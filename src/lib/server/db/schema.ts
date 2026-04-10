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
	authorId: text("author_id")
		.notNull()
		.references(() => users.id),
	title: text("title").notNull(),
	description: text("description").notNull(),
	code: text("code").notNull(),
	languageId: text("language_id").references(() => languages.id),
	isPublic: boolean("is_public").notNull(),
	publishedAt: timestamp("published_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const tags = pgTable("tags", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const snippetTags = pgTable(
	"snippet_tags",
	{
		snippetId: integer("snippet_id")
			.notNull()
			.references(() => snippets.id, { onDelete: "cascade" }),
		tagId: integer("tag_id")
			.notNull()
			.references(() => tags.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(t) => [primaryKey({ columns: [t.snippetId, t.tagId] })],
)

export const languages = pgTable("languages", {
	id: text("id").primaryKey(),
	extension: text("extension").notNull(),
	color: text("color").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
})
