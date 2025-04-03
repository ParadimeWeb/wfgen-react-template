import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import './arktypeconfig';
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider, type MutationFunction } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import reportWebVitals from "./reportWebVitals";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { PendingComponent } from "./components/PendingComponent";
import type { ActionResult, WfgFormData } from "./types";

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

function createFakeViewState() {
    const input = document.createElement('input');
    input.name = '__VIEWSTATE';
    input.type = 'hidden';
    input.value = '__VIEWSTATE';
    return input;
}
const viewState = document.getElementById('__VIEWSTATE') as HTMLInputElement | null ?? createFakeViewState();
const form = document.forms.length > 0 ? document.forms[0] : null;
const axiosInstance = axios.create({
    baseURL: form?.action,
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
});

function validateASPXWebForm() {
    if (!form) {
        throw new Error('Missing form element. ASP.NET webform needs a runat server form.');
    }
}
export function post<T>(action: string, { url, data, config, withViewState = true }: { url?: string, data?: FormData, config?: AxiosRequestConfig<FormData> | undefined, withViewState?: boolean } = {}) {
    validateASPXWebForm();
    const formData = data ?? new FormData();
    if (withViewState) {
        formData.set('__VIEWSTATE', viewState.value);
    }
    formData.set('__WFGENACTION', action);
    return axiosInstance.post<T>(url ?? '', formData, config);
}
export const asyncAction: MutationFunction<AxiosResponse<ActionResult, any>, WfgFormData> = (formData) => {
    const data = new FormData();
    data.set('FormData', new Blob([JSON.stringify(formData)], { type: 'application/json' }), 'FormDataJson');
    return post<ActionResult>(formData.Table1[0].FORM_ACTION ?? 'ASYNC_SAVE', { data });
}

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
    routeTree,
    context: { queryClient, i18n },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    defaultPendingComponent: () => <PendingComponent />
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// Render the app
const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);
root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
