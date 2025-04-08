import {
	Field,
	makeStyles,
	mergeClasses,
	TagPicker,
	TagPickerControl,
	TagPickerInput,
	tokens
} from "@fluentui/react-components";
import { useForm, useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { DataRow } from "../../../types";
import { ComplexTagPickerList } from "./ComplexTagPickerList";
import { useTranslation } from "react-i18next";
import { UserTag } from "./User/UserTag";
import { UserTagPickerGroup } from "./User/UserTagPickerGroup";
import { UserTagPickerOption } from "./User/UserTagPickerOption";
import { csvToSet } from "../../../utils";
import { useFormInitQuery } from "../../../hooks/useFormInitQuery";
import { useWfgFormContext } from "../../../hooks/useWfgFormContext";
import { useFieldContext } from "../../../hooks/formContext";
import type { ComplexTagPickerProps } from "./types";

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
function ReadonlyView(props: ComplexTagPickerProps) {
	const { readonlyFieldProps = props.fieldProps, readonlyTagProps, TagComponent = UserTag } = props;
	const styles = usePrintStyles();
	const field = useFieldContext<DataRow[]>();
	const { form } = useWfgFormContext();
	const { t } = useTranslation();

	return (
		<form.Subscribe 
			selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
			children={FORM_FIELDS_REQUIRED => {
				const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
				const required = requiredFields.has(field.name);
				return (
					<Field
						required={required}
						label={t(field.name)}
						{...readonlyFieldProps}
					>
						<div 
							className={mergeClasses(styles.root, readonlyFieldProps?.size === 'small' && styles.small, readonlyFieldProps?.size === 'large' && styles.large)}
						>
							{field.state.value.map((r, i) => <TagComponent key={`tag-${i}`} row={r} fieldProps={readonlyFieldProps} tagProps={readonlyTagProps} />)}
						</div>
					</Field>
				);
			}}
		/>
	);
}
function View(props: ComplexTagPickerProps) {
	const { fieldProps, tagPickerProps, queryOptions, limit, TagPickerGroupComponent = UserTagPickerGroup, TagPickerOptionComponent = UserTagPickerOption } = props;
	const queryClient = useQueryClient();
	const field = useFieldContext<DataRow[]>();
	const { t } = useTranslation();
	const { form } = useWfgFormContext();
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
		<form.Subscribe 
			selector={s => s.values.Table1[0].FORM_FIELDS_REQUIRED}
			children={FORM_FIELDS_REQUIRED => {
				const requiredFields = csvToSet(FORM_FIELDS_REQUIRED);
				const required = requiredFields.has(field.name);
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
													field.handleChange([row!]);
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
													field.handleChange(field.state.value.filter((r) => r.UserName !== data.value));
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
			}}
		/>
	);
}
export default (props: ComplexTagPickerProps) => {
	const field = useFieldContext();
	const { form, printForm: { state: { values: { open: isPrintView } } } } = useWfgFormContext();
	const { isArchive } = useFormInitQuery();
	const FORM_FIELDS_READONLY = useStore(form.store, s => s.values.Table1[0].FORM_FIELDS_READONLY ?? '');
	const readonlyFields = csvToSet(FORM_FIELDS_READONLY);
	return isPrintView ? <PrintView {...props} /> : isArchive || readonlyFields.has(field.name) ? <ReadonlyView {...props} /> : <View {...props} />;
};
