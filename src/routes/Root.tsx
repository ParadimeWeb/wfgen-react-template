import { makeStaticStyles } from "@fluentui/react-components";
import { printPageMargin } from "../components/Form/Provider";
import { useEffect } from "react";
import { Outlet } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

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

export const Root = () => {
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
        };
    }, []);

    return <>
        <Outlet />
        <ReactQueryDevtools />
        <TanStackRouterDevtools />
    </>;
}