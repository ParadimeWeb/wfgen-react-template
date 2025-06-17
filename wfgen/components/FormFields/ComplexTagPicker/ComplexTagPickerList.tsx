import { useInfiniteQuery } from "@tanstack/react-query"
import { Button, Spinner, TagPickerList, TagPickerOptionGroup } from "@fluentui/react-components"
import { UserTagPickerOption } from "@wfgen/components/FormFields/ComplexTagPicker/User/UserTagPickerOption";
import { filterUserRows } from "@wfgen/components/FormFields/ComplexTagPicker/User";
import { useTranslation } from "react-i18next";
import type { ComplexTagPickerListProps } from "@wfgen/components/FormFields/ComplexTagPicker/types";

export const ComplexTagPickerList = (props: ComplexTagPickerListProps) => {
    const { rows, localQuery = false, queryOptions, query, TagPickerOptionComponent = UserTagPickerOption, filterRows = filterUserRows, textKey, valueKey } = props;
    const { t } = useTranslation();
    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(queryOptions(localQuery ? '' : query));
    const total = data?.pages[0].Total ?? 0;
    const allRows = data?.pages.flatMap(data => data.Rows) ?? [];
    const filteredRows = filterRows({ rows: allRows, query, textKey, valueKey });

    return (
        <TagPickerList style={{ maxHeight: 480 }}>
            <TagPickerOptionGroup label={isLoading ? t('Loading...') : filteredRows.length ? t(`Showing {{count}} of {{total}}`, { count: filteredRows.length, total: total }) : t("We couldn't find any matches")}>
                {filteredRows.map((r, i) => <TagPickerOptionComponent key={`tagPickerOption-${i}`} row={r} rows={rows} textKey={textKey} valueKey={valueKey} />)}
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