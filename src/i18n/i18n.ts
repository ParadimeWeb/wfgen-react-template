import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
        resources: {},
        supportedLngs: ["en", "fr"],
        fallbackLng: "en",
        nonExplicitSupportedLngs: true,
        saveMissing: true,
        saveMissingTo: "all",
        debug: import.meta.env.DEV,
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });
// i18n.on('missingKey', (lngs, namespace, key, res) => {
//     const data = new FormData();
//     data.set('key', key);
//     // post('ASYNC_MISSING_KEY', { data });
// });
export default i18n;