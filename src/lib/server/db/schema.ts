import { defineRelations } from "drizzle-orm"
import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	display: text("display").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const snippets = pgTable("snippets", {
	id: serial("id").primaryKey(),
	authorId: text("author_id").notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	code: text("code").notNull(),
	languageId: text("language_id"),
	isPublic: boolean("is_public").notNull(),
	publishedAt: timestamp("published_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const tags = pgTable("tags", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	snippetId: integer("snippet_id").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const snippetTags = pgTable(
	"snippet_tags",
	{
		snippetId: integer("snippet_id")
			.notNull()
			.references(() => snippets.id),
		tagId: integer("tag_id")
			.notNull()
			.references(() => tags.id),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(t) => [primaryKey({ columns: [t.snippetId, t.tagId] })],
)

export const languages = pgTable("languages", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	extension: text("extension").notNull(),
	color: text("color").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const snippetAuthor = defineRelations({ users, snippets }, (r) => ({
	snippets: {
		author: r.one.users({
			from: r.snippets.authorId,
			to: r.users.id,
		}),
	},
	users: {
		snippets: r.many.snippets(),
	},
}))

export const snippetLanguage = defineRelations(
	{ languages, snippets },
	(r) => ({
		snippets: {
			language: r.one.languages({
				from: r.snippets.languageId,
				to: r.languages.id,
			}),
		},
		languages: {
			snippets: r.many.snippets(),
		},
	}),
)

export const snippetTag = defineRelations(
	{ tags, snippets, snippetTags },
	(r) => ({
		snippets: {
			tags: r.many.tags({
				from: r.snippets.id.through(r.snippetTags.snippetId),
				to: r.tags.id.through(r.snippetTags.tagId),
			}),
		},
		tags: {
			snippets: r.many.snippets(),
		},
	}),
)
