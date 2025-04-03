import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { post } from "./main";
import { QueryResult, WfgDataSet, WfgInitData } from "./types";
import { type } from "arktype";
import { NumberParser } from "./utils";

export const initQueryOptions = queryOptions({
    queryKey: ["ASYNC_INIT"],
    queryFn: async () => {
        const wfgenAction = document.getElementById('__WFGENACTION') as HTMLInputElement | null;
        let action = 'ASYNC_INIT';
        let withViewState = true;
        const fd = new FormData();
        if (wfgenAction !== null) {
            withViewState = false;
            action = `ASYNC_${wfgenAction.value}`;
            const ID_PROCESS_INST = document.getElementById('ID_PROCESS_INST') as HTMLInputElement;
            const ID_ACTIVITY_INST = document.getElementById('ID_ACTIVITY_INST') as HTMLInputElement;
            fd.set('ID_PROCESS_INST', ID_PROCESS_INST.value);
            fd.set('ID_ACTIVITY_INST', ID_ACTIVITY_INST.value);
            fd.set('DATA_NAME', 'FORM_DATA');
        }
        else {
            fd.set('version', __APP_VERSION__);
        }
        const { data } = await post<WfgDataSet>(action, { data: fd, withViewState });
        const initData = WfgInitData(data);
        if (initData instanceof type.errors) {
            throw new Error(initData.summary);
        }
        const { __Configuration: [configuration], __Assignee: [assignee], __CurrentUser: [currentUser], ...wfgFormData } = initData.WfgDataSet;
        const commands = {
            'MAIN': new Set(wfgFormData.Table1[0].FORM_FIELDS_COMMANDS ? wfgFormData.Table1[0].FORM_FIELDS_COMMANDS.split(',').filter(o=>o) : []),
            'FAR': new Set(wfgFormData.Table1[0].FORM_FIELDS_COMMANDS_FAR ? wfgFormData.Table1[0].FORM_FIELDS_COMMANDS_FAR.split(',').filter(o=>o) : []),
            'MORE': new Set(wfgFormData.Table1[0].FORM_FIELDS_COMMANDS_MORE ? wfgFormData.Table1[0].FORM_FIELDS_COMMANDS_MORE.split(',').filter(o=>o) : [])
        };
        const numberFormat = new Intl.NumberFormat(initData.Locale);
        const numberParser = new NumberParser(initData.Locale);
        const absoluteBaseUrl = configuration.WF_ABS_URL.substring(0, configuration.WF_ABS_URL.lastIndexOf('/') + 1);
        const rootUrl = absoluteBaseUrl.substring(0, absoluteBaseUrl.indexOf('/', absoluteBaseUrl.indexOf('//') + 2) + 1);
        const graphQLUrl = `${rootUrl}graphQL`;
        const delegatorUserId = currentUser.id !== assignee.id ? assignee.id : -1;
        const formArchiveUrl = typeof wfgFormData.Table1[0].FORM_ARCHIVE_URL === 'string' ? wfgFormData.Table1[0].FORM_ARCHIVE_URL : '';
        
        return { 
            wfgFormData,
            configuration,
            assignee,
            currentUser,
            rootUrl,
            graphQLUrl,
            delegatorUserId,
            isArchive: commands.MAIN.has('ARCHIVE'),
            formArchiveUrl,
            commands,
            locale: initData.Locale,
            timeZoneInfo: initData.TimeZoneInfo,
            numberFormat,
            numberParser
        };
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
});

export const employeesQueryOptions = (query: string, pageSize = 40) =>
    infiniteQueryOptions({
        queryKey: ["employees", query],
        queryFn: async ({ signal, queryKey, pageParam }) => {
            const data = new FormData();
            data.set("page", pageParam.toString());
            data.set("pageSize", pageSize.toString());
            data.set("query", queryKey[1] as string);
            const res = await post<QueryResult>("ASYNC_GetUsers", {
                data,
                config: { signal },
            });
            return res.data;
        },
        getNextPageParam: (lastPage, _, lastPageParam) => {
            return lastPage.HasNextPage ? lastPageParam + 1 : undefined;
        },
        initialPageParam: 1,
        retry: false,
        refetchOnMount: true,
        staleTime: 5 * 60 * 1000,
    });
export type QueryOptionsWithQuery = typeof employeesQueryOptions;
