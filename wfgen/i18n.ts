import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const missingKeys = new Set<string>();
i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
        resources: {},
        supportedLngs: ["en"],
        fallbackLng: "en",
        nonExplicitSupportedLngs: true,
        saveMissing: __SAVE_MISSING_TRANSLATION_KEYS,
        missingKeyHandler: (_lngs, _ns, key) => {
            missingKeys.add(key);
        },
        debug: import.meta.env.DEV,
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });
export default i18n;