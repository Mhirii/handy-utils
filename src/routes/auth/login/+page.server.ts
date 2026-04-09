import { fail, redirect } from "@sveltejs/kit"
import { Client, type StytchError } from "stytch"
import { superValidate } from "sveltekit-superforms"
import { zod4 } from "sveltekit-superforms/adapters"
import { STYTCH_CLIENT_SECRET, STYTCH_PROJECT_ID } from "$env/static/private"
import type { Actions, PageServerLoad } from "./$types.js"
import { formSchema } from "./schema"

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(formSchema)),
	}
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(formSchema))
		if (!form.valid) {
			return fail(400, {
				form,
			})
		}
		const client = new Client({
			project_id: STYTCH_PROJECT_ID,
			secret: STYTCH_CLIENT_SECRET,
		})
		const res = await client.passwords
			.authenticate({
				email: form.data.email,
				password: form.data.password,
				session_duration_minutes: 60,
			})
			.catch((e) => {
				return e as StytchError
			})
		if ("error_details" in res) {
			console.log("error")
			console.log(res)
			console.log("---")

			return fail(400, {
				error: {
					status_code: res.status_code,
					type: res.error_type,
					message: res.error_message,
				},
				form,
			})
		}
		const display = form.data.email.split("@")[0]

		console.log(res)
		const cookies = {
			session_jwt: res.session_jwt,
			session_token: res.session_token,
			user_id: res.user_id,
			display,
		}
		for (const [k, v] of Object.entries(cookies)) {
			console.log(`setting cookie ${k}=${v}`)
			event.cookies.set(k, v, { path: "/" })
		}
		return redirect(302, "/")
	},
}
