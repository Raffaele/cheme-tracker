import it from './locales/it.js';
import en from './locales/en.js';
import fr from './locales/fr.js';
import es from './locales/es.js';
import de from './locales/de.js';

export type LocaleCode = 'it' | 'en' | 'fr' | 'es' | 'de';
export type TranslationKey = keyof typeof it;
export type Translations = Record<TranslationKey, string>;

const STORAGE_KEY = 'chemo-tracker-locale';
const DEFAULT_LOCALE: LocaleCode = 'it';

const LOCALES: Record<LocaleCode, Translations> = { it, en, fr, es, de };

export const LOCALE_LABELS: Record<LocaleCode, string> = {
	it: 'Italiano',
	en: 'English',
	fr: 'Français',
	es: 'Español',
	de: 'Deutsch'
};

function loadLocale(): LocaleCode {
	if (typeof localStorage === 'undefined') return DEFAULT_LOCALE;
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored && stored in LOCALES) return stored as LocaleCode;
	return DEFAULT_LOCALE;
}

function createI18n() {
	let locale = $state<LocaleCode>(loadLocale());

	function t(key: TranslationKey): string {
		return LOCALES[locale][key] ?? LOCALES[DEFAULT_LOCALE][key] ?? key;
	}

	function setLocale(code: LocaleCode): void {
		locale = code;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, code);
		}
	}

	return {
		get locale() {
			return locale;
		},
		t,
		setLocale
	};
}

export const i18n = createI18n();
