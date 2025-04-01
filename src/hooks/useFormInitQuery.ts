import { useSuspenseQuery } from "@tanstack/react-query";
import { initQueryOptions } from "../queryOptions";

export const useFormInitQuery = () => {
    const { data } = useSuspenseQuery(initQueryOptions);
    return data;
}