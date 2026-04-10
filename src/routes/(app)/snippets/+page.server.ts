import { fail, redirect } from "@sveltejs/kit"
import { count, eq } from "drizzle-orm"
import { superValidate } from "sveltekit-superforms"
import { zod4 } from "sveltekit-superforms/adapters"
import { db } from "$lib/server/db"
import { snippets, snippetTags, tags } from "$lib/server/db/schema"
import type { Actions, PageServerLoad } from "./$types"
import { newSnippetSchema } from "./schema"

export const load: PageServerLoad = async ({ cookies, url }) => {
	const id = cookies.get("user_id")
	// if (!id) return redirect(307, "/snippets/public")

	const pageParam = url.searchParams.get("page") || "1"
	const sizeParam = url.searchParams.get("pageSize") || "6"
	const searchParam = url.searchParams.get("q") || ""
	const languageParam = url.searchParams.get("language") || ""
	const tagsParam = url.searchParams.get("tags") || ""
	const tagsMatchModeParam = url.searchParams.get("tagsMatchMode") || "any"

	let page = Number.parseInt(pageParam, 10)
	if (Number.isNaN(page) || page < 1) page = 1
	let size = Number.parseInt(sizeParam, 10)
	if (Number.isNaN(size) || size < 1 || size > 50) size = 6

	const languageIds = languageParam
		? languageParam.split(",").map((l) => l.trim())
		: null
	const selectedTags = tagsParam
		? tagsParam.split(",").map((t) => t.trim())
		: null

	const snippetFilters = {
		...(id ? { authorId: id } : { isPublic: true }),
		AND: [
			...(languageIds && languageIds.length > 0
				? [{ languageId: { in: languageIds } }]
				: []),
			...(selectedTags && selectedTags.length > 0
				? tagsMatchModeParam !== "all"
					? [{ tags: { name: { in: selectedTags || [] } } }]
					: selectedTags.map((tag) => ({ tags: { name: tag } }))
				: []),
		],
		OR: [
			{ title: { ilike: `%${searchParam}%` } },
			{ description: { ilike: `%${searchParam}%` } },
			{ code: { ilike: `%${searchParam}%` } },
			{ languageId: { ilike: `%${searchParam}%` } },
			{ tags: { name: { ilike: `%${searchParam}%` } } },
		],
	}

	const snippetsResult = db.query.snippets.findMany({
		where: snippetFilters,
		with: {
			tags: true,
			language: true,
			author: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
		limit: size,
		offset: (page - 1) * size,
		extras: {
			total: db.$count(
				snippets,
				id ? eq(snippets.authorId, id) : eq(snippets.isPublic, true),
			),
		},
	})

	const totalFiltered = db.query.snippets
		.findMany({
			where: snippetFilters,
			columns: {
				id: true,
			},
		})
		.then((snippets) => snippets.length)

	const languagesPromise = db.query.languages.findMany({
		columns: {
			id: true,
			extension: true,
			color: true,
		},
		where: {
			snippets: {
				title: { isNotNull: true },
				...(id ? { authorId: id } : { isPublic: true }),
			},
		},
	})
	const tagsPromise = db.query.tags.findMany({
		columns: {
			id: true,
			name: true,
		},
		where: {
			snippets: {
				title: { isNotNull: true },
				...(id ? { authorId: id } : { isPublic: true }),
			},
		},
	})

	const formattedSnippets = snippetsResult.then((snippets) =>
		snippets.map((s) => ({
			id: s.id,
			title: s.title,
			description: s.description,
			code: s.code,
			language: s.language?.id || "text",
			languageColor: s.language?.color || null,
			tags: s.tags.map((t) => t.name),
			isPublic: s.isPublic,
			createdAt: s.createdAt.toISOString(),
			updatedAt: s.updatedAt.toISOString(),
		})),
	)

	return {
		userId: id ? id : null,
		form: await superValidate(zod4(newSnippetSchema)),
		snippets: formattedSnippets,
		languagesPromise,
		tagsPromise,
		totalCount: totalFiltered,
		page,
		pageSize: size,
		filters: {
			search: searchParam,
			language: languageParam,
			tags: selectedTags || [],
			tagsMatchMode: tagsMatchModeParam as "any" | "all",
		},
	}
}

export const actions: Actions = {
	create: async ({ request, cookies }) => {
		const id = cookies.get("user_id")
		if (!id) return fail(401, { message: "Unauthorized" })

		const formData = await request.formData()
		const title = formData.get("title")?.toString().trim()
		const description = formData.get("description")?.toString().trim()
		const code = formData.get("code")?.toString().trim()
		const languageId = formData.get("language")?.toString().trim()
		const tagsString = formData.get("tags")?.toString().trim()
		const isPublic = formData.get("isPublic") === "on"

		if (!title || !code) {
			return fail(400, { message: "Title and code are required" })
		}

		const tagNames = tagsString
			? tagsString
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean)
			: []

		const existingTags = await db.query.tags.findMany({
			columns: { id: true, name: true },
		})

		const existingTagMap = new Map(
			existingTags.map((t) => [t.name.toLowerCase(), t]),
		)
		const tagIdsToLink: number[] = []

		for (const tagName of tagNames) {
			const existingTag = existingTagMap.get(tagName.toLowerCase())
			if (existingTag) {
				tagIdsToLink.push(existingTag.id)
			} else {
				const [newTag] = await db
					.insert(tags)
					.values({ name: tagName })
					.returning({ id: tags.id })
				if (newTag) {
					tagIdsToLink.push(newTag.id)
				}
			}
		}

		const now = new Date()
		const [newSnippet] = await db
			.insert(snippets)
			.values({
				authorId: id,
				title,
				description: description || "",
				code,
				languageId: languageId || null,
				isPublic,
				publishedAt: isPublic ? now : null,
			})
			.returning({ id: snippets.id })

		if (!newSnippet) {
			return fail(500, { message: "Failed to create snippet" })
		}

		if (tagIdsToLink.length > 0) {
			await db.insert(snippetTags).values(
				tagIdsToLink.map((tagId) => ({
					snippetId: newSnippet.id,
					tagId,
					createdAt: now,
					updatedAt: now,
				})),
			)
		}

		redirect(303, "/snippets")
	},
	delete: async ({ request, cookies }) => {
		const id = cookies.get("user_id")
		if (!id) return fail(401, { message: "Unauthorized" })

		const formData = await request.formData()
		const snippetId = formData.get("snippetId")?.toString()

		if (!snippetId) {
			return fail(400, { message: "Snippet ID is required" })
		}

		const snippet = await db.query.snippets.findFirst({
			where: {id: Number.parseInt(snippetId, 10)},
		})

		if (!snippet) {
			return fail(404, { message: "Snippet not found" })
		}

		if (snippet.authorId !== id) {
			return fail(403, { message: "Forbidden" })
		}

		// Delete snippet (cascade will delete snippet_tags entries)
		await db.delete(snippets).where(eq(snippets.id, snippet.id))

		return { success: true }
	},
}
