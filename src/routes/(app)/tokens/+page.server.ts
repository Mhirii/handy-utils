import { countTokens as anthropicCount } from "@anthropic-ai/tokenizer"
import { AutoTokenizer, env } from "@xenova/transformers"
import { encoding_for_model, get_encoding } from "tiktoken"
import type { Actions, PageServerLoad } from "./$types"

// Optional: Configure transformers cache directory if needed, otherwise it uses memory/temp
env.allowLocalModels = false

const aiModels = [
	// OpenAI (prices stable for many legacy models; new GPT-5.x family added)
	{ provider: "OpenAI", name: "gpt-4o", inputPrice: 2.5, outputPrice: 10 },
	{
		provider: "OpenAI",
		name: "gpt-4o-mini",
		inputPrice: 0.15,
		outputPrice: 0.6,
	},
	{ provider: "OpenAI", name: "o1-preview", inputPrice: 15, outputPrice: 60 },
	{ provider: "OpenAI", name: "o1-mini", inputPrice: 3, outputPrice: 12 },
	{ provider: "OpenAI", name: "gpt-4-turbo", inputPrice: 10, outputPrice: 30 },

	// Newer OpenAI models (2025–2026)
	{ provider: "OpenAI", name: "gpt-5.4", inputPrice: 2.5, outputPrice: 15 },
	{
		provider: "OpenAI",
		name: "gpt-5.4-mini",
		inputPrice: 0.75,
		outputPrice: 4.5,
	},
	{ provider: "OpenAI", name: "gpt-5.2", inputPrice: 1.75, outputPrice: 14 },

	// Anthropic (Claude 3.x mostly legacy; Claude 4.x family is current)
	{
		provider: "Anthropic",
		name: "claude-3-5-sonnet-20240620",
		inputPrice: 3,
		outputPrice: 15,
	},
	{
		provider: "Anthropic",
		name: "claude-3-opus-20240229",
		inputPrice: 15,
		outputPrice: 75,
	},
	{
		provider: "Anthropic",
		name: "claude-3-haiku-20240307",
		inputPrice: 0.25,
		outputPrice: 1.25,
	},

	// Current Anthropic Claude 4.x (recommended)
	{
		provider: "Anthropic",
		name: "claude-sonnet-4.6",
		inputPrice: 3,
		outputPrice: 15,
	},
	{
		provider: "Anthropic",
		name: "claude-opus-4.6",
		inputPrice: 5,
		outputPrice: 25,
	},
	{
		provider: "Anthropic",
		name: "claude-haiku-4.5",
		inputPrice: 1,
		outputPrice: 5,
	},

	// Grok / xAI (grok-2 and grok-beta are older; Grok 3/4 family is current)
	{
		provider: "Grok",
		name: "grok-2",
		inputPrice: 2,
		outputPrice: 10,
		hfId: "Xenova/grok-1-tokenizer",
	},
	{
		provider: "Grok",
		name: "grok-beta",
		inputPrice: 5,
		outputPrice: 15,
		hfId: "Xenova/grok-1-tokenizer",
	},

	// Current xAI models
	{
		provider: "Grok",
		name: "grok-3",
		inputPrice: 3,
		outputPrice: 15,
	},
	{
		provider: "Grok",
		name: "grok-3-mini",
		inputPrice: 0.3,
		outputPrice: 0.5,
	},
	{
		provider: "Grok",
		name: "grok-4",
		inputPrice: 3,
		outputPrice: 15,
	},
	{
		provider: "Grok",
		name: "grok-4.1-fast",
		inputPrice: 0.2,
		outputPrice: 0.5,
	},

	// Mistral (large-latest pricing has dropped significantly)
	{
		provider: "Mistral",
		name: "mistral-large-latest",
		inputPrice: 0.5,
		outputPrice: 1.5,
		hfId: "mistralai/Mistral-Large-Instruct-2407",
	},
	{
		provider: "Mistral",
		name: "mistral-small-latest",
		inputPrice: 0.15, // updated from older 0.2
		outputPrice: 0.6,
		hfId: "mistralai/Mistral-7B-Instruct-v0.3",
	},
	{
		provider: "Mistral",
		name: "codestral-latest",
		inputPrice: 0.3,
		outputPrice: 0.9,
		hfId: "mistralai/Codestral-22B-v0.1",
	},

	// Additional popular Mistral models
	{
		provider: "Mistral",
		name: "mistral-large-3",
		inputPrice: 0.5,
		outputPrice: 1.5,
	},

	// Qwen (Alibaba Cloud – prices can vary by region; these are standard international rates)
	{
		provider: "Qwen",
		name: "qwen-max",
		inputPrice: 1.6,
		outputPrice: 6.4,
		hfId: "Qwen/Qwen2.5-72B-Instruct",
	},
	{
		provider: "Qwen",
		name: "qwen-plus",
		inputPrice: 0.4,
		outputPrice: 1.2,
		hfId: "Qwen/Qwen2.5-72B-Instruct",
	},

	// DeepSeek (very competitive; cache-hit pricing is much lower)
	{
		provider: "DeepSeek",
		name: "deepseek-chat (V3.2)",
		inputPrice: 0.28, // cache-miss; cache-hit ~0.028
		outputPrice: 0.42,
		hfId: "deepseek-ai/DeepSeek-V3",
	},
	{
		provider: "DeepSeek",
		name: "deepseek-coder",
		inputPrice: 0.14,
		outputPrice: 0.28,
		hfId: "deepseek-ai/DeepSeek-Coder-V2-Base",
	},

	// Kimi (Moonshot AI) – older moonshot-v1 is legacy; K2 series is current
	{
		provider: "Kimi",
		name: "moonshot-v1-8k",
		inputPrice: 1.6, // your original (roughly accurate for legacy)
		outputPrice: 1.6,
	},
	{
		provider: "Kimi",
		name: "kimi-k2",
		inputPrice: 0.6,
		outputPrice: 2.5,
	},

	// MiniMax (abab6.5 is older; M2.x series is current flagship)
	{
		provider: "MiniMax",
		name: "abab6.5-chat",
		inputPrice: 1.5,
		outputPrice: 1.5,
	},
	{
		provider: "MiniMax",
		name: "minimax-m2.5",
		inputPrice: 0.15,
		outputPrice: 1.2,
	},
	{
		provider: "MiniMax",
		name: "minimax-m2.7",
		inputPrice: 0.3,
		outputPrice: 1.2,
	},

	// Google Gemini
	{
		provider: "Google",
		name: "gemini-1.5-pro",
		inputPrice: 3.5, // your original (long context higher)
		outputPrice: 10.5,
	},

	// Current Gemini models (cheaper options available)
	{
		provider: "Google",
		name: "gemini-2.0-flash",
		inputPrice: 0.1,
		outputPrice: 0.4,
	},
	{
		provider: "Google",
		name: "gemini-2.5-pro",
		inputPrice: 1,
		outputPrice: 10,
	},

	// Others / Local
	{ provider: "Local", name: "Ollama (local)", inputPrice: 0, outputPrice: 0 },
]

const tokenizerCache = new Map()

async function getAccurateTokenCount(
	text: string,
	provider: string,
	modelName: string,
	hfId?: string,
): Promise<number> {
	if (!text) return 0

	try {
		if (provider === "OpenAI") {
			try {
				// @ts-expect-error - catch block handles unsupported models
				const enc = encoding_for_model(modelName)
				const tokens = enc.encode(text).length
				enc.free()
				return tokens
			} catch {
				const enc = get_encoding("o200k_base")
				const tokens = enc.encode(text).length
				enc.free()
				return tokens
			}
		}

		if (provider === "Anthropic") {
			return anthropicCount(text)
		}

		if (hfId) {
			if (!tokenizerCache.has(hfId)) {
				const tokenizer = await AutoTokenizer.from_pretrained(hfId)
				tokenizerCache.set(hfId, tokenizer)
			}
			const tokenizer = tokenizerCache.get(hfId)
			const encoded = await tokenizer(text)
			return encoded.input_ids.size
		}

		// Fallback for Google, Kimi, MiniMax, Local (uses OpenAI's cl100k_base as closest generic approximation)
		const enc = get_encoding("cl100k_base")
		const tokens = enc.encode(text).length
		enc.free()
		return tokens
	} catch (error) {
		console.error(`Tokenizer error for ${modelName}:`, error)
		return Math.ceil(text.length / 4) // Absolute fallback
	}
}

export const load: PageServerLoad = async () => {
	return { aiModels }
}

export const actions: Actions = {
	calculate: async ({ request }) => {
		const formData = await request.formData()
		const text = formData.get("text")?.toString() || ""
		const selectedModelName = formData.get("model")?.toString() || ""

		const wordCount = text ? text.trim().split(/\s+/).filter(Boolean).length : 0
		const charCount = text ? text.length : 0
		const charCountNoSpaces = text ? text.replace(/\s/g, "").length : 0

		const targetModel =
			aiModels.find((m) => m.name === selectedModelName) || aiModels[0]

		// Accurate token calculation
		const tokenCount = await getAccurateTokenCount(
			text,
			targetModel.provider,
			targetModel.name,
			targetModel.hfId,
		)

		const costs = aiModels.map((model) => {
			if (model.name === "Ollama (local)") {
				return { name: model.name, inputCost: "N/A", outputCost: "N/A" }
			}
			const tokensM = tokenCount / 1000000
			return {
				name: model.name,
				inputCost: `$${(model.inputPrice * tokensM).toFixed(4)}`,
				outputCost: `$${(model.outputPrice * tokensM).toFixed(4)}`,
			}
		})

		return {
			tokenCount,
			wordCount,
			charCount,
			charCountNoSpaces,
			costs,
		}
	},
}
