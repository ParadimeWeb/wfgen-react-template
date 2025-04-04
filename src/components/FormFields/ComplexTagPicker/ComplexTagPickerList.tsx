import { useInfiniteQuery } from "@tanstack/react-query"
import { Button, Spinner, TagPickerList, TagPickerOptionGroup } from "@fluentui/react-components"
import { UserTagPickerOption } from "./User/UserTagPickerOption";
import { filterUserRows } from "./User";
import { useTranslation } from "react-i18next";
import type { ComplexTagPickerListProps } from "./types";

export const ComplexTagPickerList = (props: ComplexTagPickerListProps) => {
    const { rows, pageSize = 40, localQuery = false, queryOptions, query, TagPickerOptionComponent = UserTagPickerOption, filterRows = filterUserRows } = props;
    const { t } = useTranslation();
    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(queryOptions(localQuery ? '' : query, pageSize));
    const total = data?.pages[0].Total ?? 0;
    const allRows = data?.pages.flatMap(data => data.Rows) ?? [];
    const filteredRows = filterRows(allRows, query);

    return (
        <TagPickerList style={{ maxHeight: 480 }}>
            <TagPickerOptionGroup label={isLoading ? t('Loading...') : filteredRows.length ? t(`Showing {{count, number}} of {{total, number}}`, { count: filteredRows.length, total: total }) : t("We couldn't find any matches")}>
                {filteredRows.map((r, i) => <TagPickerOptionComponent key={`tagPickerOption-${i}`} row={r} rows={rows} />)}
                {hasNextPage ?
                    <div>
                        <Button
                            disabled={isFetchingNextPage}
                            icon={isFetchingNextPage ? <Spinner size="extra-tiny" /> : undefined}
                            onClick={() => { fetchNextPage(); }}
                        >
                            {isFetchingNextPage ? t('Loading...') : t('Load more')}
                        </Button>
                    </div>
                    : null}
            </TagPickerOptionGroup>
        </TagPickerList>
    );
}