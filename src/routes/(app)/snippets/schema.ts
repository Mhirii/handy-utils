import { z } from "zod"

export const newSnippetSchema = z.object({
	title: z.string().min(1).max(50),
	description: z.string().optional(),
	code: z.string().min(1),
	language: z.string().default("plaintext"),
	tags: z.string().default(""),
	isPublic: z.boolean().default(false),
})

export type NewSnippetSchema = typeof newSnippetSchema
