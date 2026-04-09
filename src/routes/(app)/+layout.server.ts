import type { SidebarElement } from "$lib/types/sidebar_elements"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ cookies }) => {
	let auth = false
	const jwt = cookies.get("session_jwt")
	if (!!jwt) auth = true
	const navElements: SidebarElement[] = [
		{
			title: "Cookie Tools",
			url: "/cookies",
			icon: "Cookie",
		},
		{
			title: "Base64 Tools",
			url: "/base64",
			icon: "Code",
		},
		{
			title: "Snippets",
			url: "/snippets",
			icon: "FileCodeCorner",
			needAuth: true,
			disabled: !auth,
		},
		{
			title: "Documentation",
			url: "#",
			icon: "BookOpen",
		},
		{
			title: "Settings",
			url: "#",
			icon: "Settings2Icon",
		},
	]

	return {
		navElements,
	}
}
