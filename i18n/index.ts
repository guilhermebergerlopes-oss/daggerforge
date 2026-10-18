import { de } from "./locales/de";
import { pt } from "./locales/pt";
import { en, TranslationKey } from "./locales/en";

export type Language = "en" | "de" | "pt";
export type TranslationParams = Record<string, string | number>;
export type TranslationFunction = (key: TranslationKey, params?: TranslationParams) => string;

const dictionaries: Record<Language, Record<TranslationKey, string>> = { en, de, pt, };
const listeners = new Set<() => void>();
let currentLanguage: Language = "en";

export function getLanguage(): Language {
	return currentLanguage;
}

export function setLanguage(language: Language): void {
	if (language === currentLanguage) return;
	currentLanguage = language;
	listeners.forEach((listener) => listener());
}

export function subscribeLanguage(listener: () => void): () => void {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export function translate(
	key: TranslationKey,
	params: TranslationParams = {},
	language: Language = currentLanguage,
): string {
	let text = dictionaries[language][key] ?? en[key];
	for (const [name, value] of Object.entries(params)) {
		text = text.split(`{${name}}`).join(String(value));
	}
	return text;
}

export type { TranslationKey } from "./locales/en";
