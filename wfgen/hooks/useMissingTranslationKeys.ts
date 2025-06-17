import { useQuery } from "@tanstack/react-query"
import { missingKeys } from "@wfgen/i18n";
import { post } from "@wfgen/utils";

export const useMissingTranslationKeys = (refetchInterval = 10 * 1000) => {
    useQuery({
        queryKey: ['ASYNC_MISSING_KEY'],
        queryFn: async () => {
            const json: { [key: string]: string } = {};
            missingKeys.forEach((key) => {
                json[key] = key;
            });
            const data = new FormData();
            data.set('MissingTranslation', new Blob([JSON.stringify(json, null, '\t')], { type: 'application/json' }), 'MissingTranslationJson');
            const res = await post<{ Result: string }>("ASYNC_MISSING_KEY", { data });
            return res.data;
        },
        initialData: { Result: 'InitialData' },
        staleTime: Infinity,
        refetchInterval,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false
    });
}