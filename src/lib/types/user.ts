import type { UsersName } from "stytch"

export type NavUserType = {
	name: string
	email: string
	avatar?: string
}

export type UserPromise = Promise<{
	name: UsersName | undefined
	user_id: string
	display: string
	emails: {
		email: string
		verified: boolean
	}[]
}>
