import {
	Code,
	ComponentIcon,
	CookieIcon,
	FileCodeCorner,
	WholeWord,
} from "@lucide/svelte"
import type { Component } from "svelte"

export type Tool = {
	title: string
	url: string
	icon: Component
	desc: string
	disabled?: boolean
}
export const tools: Array<Tool> = [
	{
		title: "Cookie Comparison",
		url: "/cookies",
		desc: "Compare different cookies to analyze their similarities and differences.",
		icon: CookieIcon,
	},
	{
		title: "Base64 Converter",
		url: "/base64",
		desc: "Easily encode strings to or decode from Base64 format in real-time.",
		icon: Code,
	},
	{
		title: "Snippet Manager",
		url: "/snippets",
		desc: "Store, manage, and quickly retrieve your saved code snippets.",
		icon: FileCodeCorner,
	},
	{
		title: "Token Calculator",
		url: "/tokens",
		desc: "Calculate token count and estimate pricing for various AI models.",
		icon: WholeWord,
	},
	{
		title: "Mermaid Diagram",
		url: "/mermaid",
		desc: "Create beautiful diagrams using the Mermaid syntax with live preview.",
		icon: ComponentIcon,
	},
]

export default tools
