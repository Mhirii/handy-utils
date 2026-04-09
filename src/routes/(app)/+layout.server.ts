import { Client } from "stytch"
import { STYTCH_CLIENT_SECRET, STYTCH_PROJECT_ID } from "$env/static/private"
import type { SidebarElement } from "$lib/types/sidebar_elements"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ cookies }) => {
	let auth = false
	const jwt = cookies.get("session_jwt")
	const userID = cookies.get("user_id")
	if (!!jwt && !!userID) auth = true
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

	if (!userID)
		return {
			navElements,
		}

	const client = new Client({
		project_id: STYTCH_PROJECT_ID,
		secret: STYTCH_CLIENT_SECRET,
	})
	const userPromise = client.users.get({ user_id: userID }).then((r) => {
		console.log(r)
		return {
			emails: r.emails.map((e) => ({ email: e.email, verified: e.verified })),
			name: r.name,
			user_id: r.user_id,
			display: r.emails[0].email.split("@")[0],
		}
	})

	return {
		navElements,
		userID,
		userPromise,
	}
}
