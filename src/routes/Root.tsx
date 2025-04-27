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
        window.addEventListener("dragover", (e) => { e.preventDefault(); }, { signal: abortController.signal });
        window.addEventListener("drop", (e) => { e.preventDefault(); }, { signal: abortController.signal });
        window.addEventListener('beforeprint', () => {}, { signal: abortController.signal });

        return () => {
            abortController.abort();
        };
    }, []);

    if (import.meta.env.DEV) {
        return <>
            <Outlet />
            <ReactQueryDevtools />
            <TanStackRouterDevtools />
        </>;
    }
    return (
        <Outlet />
    );
}