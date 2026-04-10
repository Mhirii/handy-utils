import { z } from "zod"

const validateTags = (tagsString: string) => {
	if (!tagsString.trim()) return true

	const tags = tagsString
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean)

	// Max 10 tags
	if (tags.length > 10) return false

	// Each tag: max 30 chars, alphanumeric + hyphen/underscore only
	return tags.every((tag) => tag.length <= 30 && /^[a-zA-Z0-9_-]+$/.test(tag))
}

export const newSnippetSchema = z.object({
	title: z.string().min(1).max(50),
	description: z.string().optional(),
	code: z.string().min(1),
	language: z.string().default("plaintext"),
	tags: z.string().default("").refine(validateTags, {
		message:
			"Invalid tags: max 10 tags, each up to 30 characters (letters, numbers, hyphens, underscores only)",
	}),
	isPublic: z.boolean().default(false),
})

export type NewSnippetSchema = typeof newSnippetSchema
