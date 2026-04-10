import { redirect } from "@sveltejs/kit"
import { eq } from "drizzle-orm"
import { db } from "$lib/server/db"
import { languages, snippets, snippetTags, tags } from "$lib/server/db/schema"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ cookies, url }) => {
	const id = cookies.get("user_id")
	if (!id) return redirect(307, "/snippets/public")
	const pageParam = url.searchParams.get("page") || "1"
	const sizeParam = url.searchParams.get("pageSize") || "12"

	let page = Number.parseInt(pageParam, 10)
	if (Number.isNaN(page) || page < 1) page = 1
	let size = Number.parseInt(sizeParam, 10)
	if (Number.isNaN(size) || size < 1 || size > 50) size = 12

	const snippetsPromise = db.query.snippets.findMany({
		where: {
			authorId: id,
		},
		limit: size,
		offset: (page - 1) * size,
		orderBy: {
			updatedAt: "desc",
		},
	})

	return { snippetsPromise, user_id: id }
}
