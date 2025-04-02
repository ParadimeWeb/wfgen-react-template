import i18n from "./i18n/i18n";
import './arktypeconfig';
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider, type MutationFunction } from "@tanstack/react-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import reportWebVitals from "./reportWebVitals";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { PendingComponent } from "./components/PendingComponent";
import type { ActionResult, WfgFormData } from "./types";

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
export function post<T>(action: string, { url, data, config }: { url?: string, data?: FormData, config?: AxiosRequestConfig<FormData> | undefined } = {}) {
    validateASPXWebForm();
    const formData = data ?? new FormData();
    formData.set('__VIEWSTATE', viewState.value);
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
