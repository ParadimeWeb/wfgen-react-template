import {
	Field,
	makeStyles,
	mergeClasses,
	TagPicker,
	TagPickerControl,
	TagPickerInput,
	tokens,
	type FieldProps,
	type TagPickerProps,
	type TagProps,
} from "@fluentui/react-components";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type ComponentType } from "react";
import type { DataRow } from "../../../types";
import { ComplexTagPickerList } from "./ComplexTagPickerList";
import { useWfgFormContext } from "../../Form/Provider";
import type { QueryOptionsWithQuery } from "../../../queryOptions";
import { useFieldContext } from "../../../hooks/useWfgForm";
import { useTranslation } from "react-i18next";
import { useFormInitQuery } from "../../../hooks/useFormInitQuery";
import { UserTag } from "./User/UserTag";
import { UserTagPickerGroup } from "./User/UserTagPickerGroup";
import { UserTagPickerOption } from "./User/UserTagPickerOption";

export type RowTagProps = {
    row: DataRow
	rows: DataRow[]
    fieldProps?: FieldProps
    tagProps?: TagProps
};

type ComplexTagPickerProps = {
	fieldProps?: FieldProps
	tagPickerProps?: TagPickerProps
	printFieldProps?: FieldProps
	printTagProps?: TagProps
	queryOptions: QueryOptionsWithQuery
	pageSize?: number
	localQuery?: boolean
	limit?: number
	TagComponent?: ComponentType<Omit<RowTagProps, 'rows'>>
	TagPickerGroupComponent?: ComponentType<Pick<RowTagProps, 'rows'>>
	TagPickerOptionComponent?: ComponentType<Pick<RowTagProps, 'row' | 'rows'>>
};

const usePrintStyles = makeStyles({
	root: {
		minHeight: '32px',
		display: 'inline-flex',
		alignItems: 'center',
		gap: tokens.spacingHorizontalXS,
		padding: `0 ${tokens.spacingHorizontalM}`
	},
	small: {
		minHeight: '24px',
		padding: `0 ${tokens.spacingHorizontalS}`
	},
	large: {
		minHeight: '40px',
		padding: `0 calc(${tokens.spacingHorizontalM} + ${tokens.spacingHorizontalSNudge})`
	}
});

function PrintView(props: ComplexTagPickerProps) {
	const { printFieldProps = props.fieldProps, printTagProps, TagComponent = UserTag } = props;
	const styles = usePrintStyles();
	const field = useFieldContext<DataRow[]>();
	const { t } = useTranslation();

	return (
		<Field
			label={t(field.name)}
			{...printFieldProps}
		>
			<div 
				className={mergeClasses(styles.root, printFieldProps?.size === 'small' && styles.small, printFieldProps?.size === 'large' && styles.large)}
			>
				{field.state.value.map((r, i) => <TagComponent key={`tag-${i}`} row={r} fieldProps={printFieldProps} tagProps={printTagProps} />)}
			</div>
		</Field>
	);
}
function View(props: ComplexTagPickerProps) {
	const { fieldProps, tagPickerProps, queryOptions, limit, TagPickerGroupComponent = UserTagPickerGroup, TagPickerOptionComponent = UserTagPickerOption } = props;
	const queryClient = useQueryClient();
	const field = useFieldContext<DataRow[]>();
	const { t } = useTranslation();
	const { requiredFields } = useFormInitQuery();
	const required = requiredFields.has(field.name);
	const tagForm = useForm({
		defaultValues: {
			inputValue: "",
			selectedOptions: field.state.value.map(
				(r) => r.UserName as string
			)
		}
	});
	const { inputValue } = tagForm.state.values;
	const [query, setQuery] = useState(inputValue);

	return (
		<tagForm.Field
			name="selectedOptions"
			children={(tagsfield) => {
				return (
					<Field
						required={required}
						label={t(field.name)}
						validationMessage={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? t(field.state.meta.errors.join(', '), { field: '' }) : null}
						{...fieldProps}
					>
						<TagPicker
							defaultSelectedOptions={tagsfield.state.value}
							onOptionSelect={(_, data) => {
								if (data.value.startsWith('selected-') || (limit !== undefined && limit > 1 && data.selectedOptions.length > limit)) {
									return;
								}
								if (data.selectedOptions.includes(data.value)) {
									const queryResult = queryClient.getQueryData(queryOptions(query).queryKey);
									let row: DataRow | undefined;
									queryResult?.pages.find((p) => {
										row = p.Rows.find((r) => r.UserName === data.value);
										if (row === undefined) {
											return false;
										}
										return true;
									});
									if (limit === 1) {
										field.setValue([row!]);
									}
									else {
										field.pushValue(row!);
									}
								} 
								else {
									if (limit === 1) {
										field.removeValue(0);
									}
									else {
										field.setValue(field.state.value.filter((r) => r.UserName !== data.value));
									}
								}
								tagForm.setFieldValue("inputValue", "");
								setQuery("");
								tagsfield.handleChange(limit === 1 ? data.selectedOptions.length === 0 ? [] : [data.value] : data.selectedOptions);
							}}
							{...tagPickerProps}
						>
							<TagPickerControl>
								<TagPickerGroupComponent rows={field.state.value} />
								<tagForm.Field
									name="inputValue"
									asyncDebounceMs={500}
									validators={{
										onChangeAsync: async ({ value }) => {
											setQuery(value);
											return undefined;
										}
									}}
									children={(field) => {
										return (
											<TagPickerInput
												value={field.state.value}
												onChange={(e) => {
													field.handleChange(e.target.value);
												}}
											/>
										);
									}}
								/>
							</TagPickerControl>
							<ComplexTagPickerList
								{...props}
								TagPickerOptionComponent={TagPickerOptionComponent}
								rows={field.state.value}
								query={query}
								selectedOptions={tagsfield.state.value}
							/>
						</TagPicker>
					</Field>
				);
			}}
		/>
	);
}
export const ComplexTagPicker = (props: ComplexTagPickerProps) => {
	const { printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
	return isPrintView ? <PrintView {...props} /> : <View {...props} />;
};
