import { fail, redirect } from "@sveltejs/kit"
import { db } from "$lib/server/db"
import { snippets, snippetTags, tags } from "$lib/server/db/schema"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ cookies, url }) => {
	const id = cookies.get("user_id")
	if (!id) return redirect(307, "/snippets/public")

	const pageParam = url.searchParams.get("page") || "1"
	const sizeParam = url.searchParams.get("pageSize") || "12"
	const searchParam = url.searchParams.get("q") || ""
	const languageParam = url.searchParams.get("language") || ""
	const tagsParam = url.searchParams.get("tags") || ""
	const tagsMatchModeParam = url.searchParams.get("tagsMatchMode") || "any"

	let page = Number.parseInt(pageParam, 10)
	if (Number.isNaN(page) || page < 1) page = 1
	let size = Number.parseInt(sizeParam, 10)
	if (Number.isNaN(size) || size < 1 || size > 50) size = 12

	const languageIds = languageParam
		? languageParam.split(",").map((l) => l.trim())
		: null
	const selectedTags = tagsParam
		? tagsParam.split(",").map((t) => t.trim())
		: null

	const snippetsResult = await db.query.snippets.findMany({
		where: { authorId: id },
		with: {
			tags: true,
			language: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
		limit: size,
		offset: (page - 1) * size,
	})

	let filteredSnippets = snippetsResult

	if (searchParam) {
		const searchLower = searchParam.toLowerCase()
		filteredSnippets = filteredSnippets.filter(
			(s) =>
				s.title.toLowerCase().includes(searchLower) ||
				s.description.toLowerCase().includes(searchLower) ||
				s.code.toLowerCase().includes(searchLower),
		)
	}

	if (languageIds) {
		filteredSnippets = filteredSnippets.filter(
			(s) => s.languageId && languageIds.includes(s.languageId),
		)
	}

	if (selectedTags && selectedTags.length > 0) {
		filteredSnippets = filteredSnippets.filter((snippet) => {
			const snippetTagNames = snippet.tags.map((t) => t.name)
			if (tagsMatchModeParam === "all") {
				return selectedTags.every((tag) => snippetTagNames.includes(tag))
			}
			return selectedTags.some((tag) => snippetTagNames.includes(tag))
		})
	}

	const [languagesResult, tagsResult] = await Promise.all([
		db.query.languages.findMany({
			columns: {
				id: true,
				extension: true,
				color: true,
			},
		}),
		db.query.tags.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
	])

	const formattedSnippets = filteredSnippets.map((s) => ({
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
	}))

	return {
		snippets: formattedSnippets,
		languages: languagesResult,
		tags: tagsResult,
		totalCount: formattedSnippets.length,
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
}
