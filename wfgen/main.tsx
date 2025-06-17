import i18n from "@wfgen/i18n";
import type { i18n as i18next } from "i18next";
import "@wfgen/arktypeconfig";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { initQueryOptions } from "@wfgen/queryOptions";
import { Root } from "@wfgen/routes/Root";
import { Form } from "@/Form";
import { FormSkeleton } from "@wfgen/components/Form/Skeleton";

dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

const queryClient = new QueryClient();

const rootRoute = createRootRouteWithContext<{
    queryClient: QueryClient
    i18n: i18next
}>()({
    loader: async ({ context: { queryClient, i18n } }) => {
        const { locale } = await queryClient.ensureQueryData(initQueryOptions);
        const languageCode = locale.substring(0, 2);
        if (!locale.startsWith('en')) {
            await import(`@/locales/${languageCode}/libraries.ts`);
            dayjs.locale(languageCode);
        }
        const resources = (await import(`@/locales/${languageCode}/translation.json`)).default;
        i18n.addResourceBundle(locale, 'translation', resources);
        if (locale !== i18n.language) {
            await i18n.changeLanguage(locale);
        }
    },
    errorComponent: (error) => <div>Error!<div>{error.error.message}</div></div>,
    notFoundComponent: () => {
        return <div>Not found</div>;
    },
    component: Root
});

const formRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/wfgen/wfapps/webforms/$process/$version/$aspx',
    component: Form
});

const archiveRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/wfgen/$aspx',
    component: Form
});

const archiveRouteV9 = createRoute({
    getParentRoute: () => rootRoute,
    path: '/wfgen/workflow/data/files/$aspx',
    component: Form
});

const routeTree = rootRoute.addChildren([formRoute, archiveRoute, archiveRouteV9]);

const router = createRouter({
    routeTree,
    context: { queryClient, i18n },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    defaultPendingComponent: FormSkeleton
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </StrictMode>
    );
}
