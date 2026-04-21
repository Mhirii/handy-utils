import type { PageServerLoad } from "./$types"

function decodeBase64Url(str: string | null): string {
	if (!str) return ""
	try {
		return decodeURIComponent(
			escape(atob(str.replace(/-/g, "+").replace(/_/g, "/"))),
		)
	} catch {
		return ""
	}
}

export const load: PageServerLoad = async ({ url }) => {
	const encoded = url.searchParams.get("code")
	return { initialCode: decodeBase64Url(encoded) }
}
