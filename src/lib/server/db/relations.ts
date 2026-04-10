import { defineRelations } from "drizzle-orm/relations"
import * as schema from "./schema"

export const relations = defineRelations(schema, (r) => ({
	snippets: {
		author: r.one.users({
			from: r.snippets.authorId,
			to: r.users.id,
		}),
		tags: r.many.tags({
			from: r.snippets.id.through(r.snippetTags.snippetId),
			to: r.tags.id.through(r.snippetTags.tagId),
		}),
		language: r.one.languages({
			from: r.snippets.languageId,
			to: r.languages.id,
		}),
	},
	users: {
		snippets: r.many.snippets(),
	},
	languages: {
		snippets: r.many.snippets(),
	},
	tags: {
		snippets: r.many.snippets(),
	},
}))
