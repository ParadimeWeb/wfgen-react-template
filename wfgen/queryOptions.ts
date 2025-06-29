import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { type Directory, type QueryResult, type WfgDataSet, WfgInitData } from "@wfgen/types";
import { type } from "arktype";
import { NumberParser, post } from "@wfgen/utils";

export const initQueryOptions = queryOptions({
    queryKey: ["ASYNC_INIT"],
    queryFn: async () => {
        const wfgenAction = document.getElementById('__WFGENACTION') as HTMLInputElement | null;
        let action = 'ASYNC_INIT';
        let withViewState = true;
        const fd = new FormData();
        if (wfgenAction !== null) {
            const ID_PROCESS_INST = document.getElementById('ID_PROCESS_INST') as HTMLInputElement;
            const ID_ACTIVITY_INST = document.getElementById('ID_ACTIVITY_INST') as HTMLInputElement;
            withViewState = false;
            action = `ASYNC_${wfgenAction.value}`;
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
            'MAIN': wfgFormData.Table1[0].FORM_FIELDS_COMMANDS ? wfgFormData.Table1[0].FORM_FIELDS_COMMANDS.split(',').filter(o=>o) : [],
            'FAR': wfgFormData.Table1[0].FORM_FIELDS_COMMANDS_FAR ? wfgFormData.Table1[0].FORM_FIELDS_COMMANDS_FAR.split(',').filter(o=>o) : [],
            'MORE': wfgFormData.Table1[0].FORM_FIELDS_COMMANDS_MORE ? wfgFormData.Table1[0].FORM_FIELDS_COMMANDS_MORE.split(',').filter(o=>o) : []
        };
        const numberFormat = new Intl.NumberFormat(initData.Locale);
        const numberParser = new NumberParser(initData.Locale);
        const absoluteBaseUrl = configuration.WF_ABS_URL.substring(0, configuration.WF_ABS_URL.lastIndexOf('/') + 1);
        const rootUrl = absoluteBaseUrl.substring(0, absoluteBaseUrl.indexOf('/', absoluteBaseUrl.indexOf('//') + 2) + 1);
        const graphQLUrl = `${rootUrl}graphQL`;
        const delegatorUserId = currentUser.id !== assignee.id ? assignee.id : -1;
        const closeFormUrl = `${rootUrl}show.aspx?QUERY=PROCESS_INSTANCE_FORM&ID_PROCESS_INST=${configuration.WF_PROCESS_INST_ID}&ID_USER_DELEGATOR=${delegatorUserId}`;
        const closeForm = () => {
            const parent = window.parent as any;
            const topFrame = parent['WFGEN_TOP']; 
            if (topFrame && typeof(topFrame.goToRequest) === 'function') {
                topFrame.goToRequest();
            }
            else {
                window.location.replace(closeFormUrl);
            }
        };
        
        return { 
            wfgFormData,
            configuration,
            assignee,
            currentUser,
            rootUrl,
            graphQLUrl,
            closeFormUrl,
            closeForm,
            delegatorUserId,
            isArchive: commands.MAIN.includes('ARCHIVE'),
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

type QueryOptions = {
    query: string
    pageSize?: number
};
type EmployeeQueryParams = QueryOptions & {
    active?: 'Y' | 'N' | null
    archive?: 'Y' | 'N' | null
    directory?: Directory[]
    extraAttributes?: string[]
};
export const employeesQueryOptions = (options: EmployeeQueryParams) => {
    const {
        query,
        active = 'Y',
        archive = 'N',
        directory = [],
        extraAttributes = [],
        pageSize = 50
    } = options;
    return infiniteQueryOptions({
        queryKey: ["employees", query],
        queryFn: async ({ signal, queryKey, pageParam }) => {
            const data = new FormData();
            data.set("page", pageParam.toString());
            data.set("pageSize", pageSize.toString());
            data.set("query", queryKey[1] as string);
            if (active !== null) {
                data.set("active", active);
            }
            if (archive !== null) {
                data.set("archive", archive);
            }
            if (directory.length > 0) {
                data.set("directory", directory.join());
            }
            if (extraAttributes.length > 0) {
                data.set("extraAttributes", extraAttributes.join());
            }
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
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000
    });
}