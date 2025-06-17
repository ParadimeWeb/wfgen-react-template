import { useSuspenseQuery } from "@tanstack/react-query";
import { initQueryOptions } from "@wfgen/queryOptions";

export const useFormInitQuery = () => {
    const { data } = useSuspenseQuery(initQueryOptions);
    return data;
}