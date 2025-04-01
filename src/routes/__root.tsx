import type { i18n as i18next } from 'i18next'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { initQueryOptions } from '../queryOptions'
import { useEffect } from 'react'
import { makeStaticStyles } from '@fluentui/react-components'
import i18n from '../i18n/i18n'
import { printPageMargin } from '../components/Form/Provider'


dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
const useStaticStyles = makeStaticStyles(`
    @page {
        margin: ${printPageMargin}in;
    }
    @media print {
        .fui-MenuPopover {
            display: none;
        }
    }
`);
export const Route = createRootRouteWithContext<{
    queryClient: QueryClient
    i18n: i18next
}>()({
    loader: async ({ context: { queryClient, i18n } }) => {
        const { locale } = await queryClient.ensureQueryData(initQueryOptions);
        const languageCode = locale.substring(0, 2);
        if (!i18n.language.startsWith('en')) {
            await import(`../i18n/locales/${languageCode}/libraries.ts`);
            dayjs.locale(languageCode);
        }
        const resources = (await import(`../i18n/locales/${languageCode}/translation.json`)).default;
        i18n.addResourceBundle(locale, 'translation', resources);
        if (locale !== i18n.language) {
            await i18n.changeLanguage(locale);
        }
    },
    errorComponent: (error) => <div>Error!<div>{error.error.message}</div></div>,
    component: () => {
        useStaticStyles();

        useEffect(() => {
            const abortController = new AbortController();
            document.forms[0].addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, { signal: abortController.signal });
            window.addEventListener("dragover", (e) => { e.preventDefault(); }, { signal: abortController.signal });
            window.addEventListener("drop", (e) => { e.preventDefault(); }, { signal: abortController.signal });
            window.addEventListener('beforeprint', () => {}, { signal: abortController.signal });

            return () => {
                abortController.abort();
                i18n.off('missingKey');
            };
        }, []);

        return <>
            <Outlet />
            <ReactQueryDevtools />
            <TanStackRouterDevtools />
        </>;
    }
})
