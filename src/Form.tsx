import { makeStyles, Option, Radio, TableCell, TableHeaderCell } from "@fluentui/react-components";
import { styleHelpers } from "@wfgen/styles";
import { FormFooter } from "@wfgen/components/Form/Footer";
import { employeesQueryOptions } from "@wfgen/queryOptions";
import { createWfgContext } from "@wfgen/hooks/useWfgForm";
import { WfgFormProvider } from "@wfgen/components/Form/Provider";
import { FormHeader } from "@wfgen/components/Form/Header";
import { FormContent } from "@wfgen/components/Form/Content";
import { type } from "arktype";
import {  makeReadonly } from "@wfgen/utils";
import { t } from "i18next";
import { SectionDivider } from "@wfgen/components/SectionDivider";
import { useEffect, useRef } from "react";

const useStyles = makeStyles({
    row: styleHelpers.row(),
    row2: styleHelpers.row(2)
});

export function Form() {
    const styles = useStyles();
    const ctx = createWfgContext();
    const { form } = ctx;

    return (
        <WfgFormProvider ctx={ctx} autoSaveInterval={60000}>
            <FormHeader />
            <FormContent printProps={{ showComments: true, showApprovals: true }}>
                <SectionDivider noTopPadding>Information</SectionDivider>
                <div className={styles.row}>
                    <form.AppField 
                        name="Table1[0].FirstName"
                        validators={{
                            onSubmit: form.getFieldValue('Table1[0].LastName') === 'Make at least 3' ? type("string > 3") : type("string > 0")
                        }}
                        children={(field) => {
                            return <field.TextField />
                        }}
                    />
                    <form.AppField 
                        name="Table1[0].LastName"
                        validators={{
                            onSubmit: type("string > 0")
                        }}
                        listeners={{
                            onBlur: ({ value }) => {
                                makeReadonly(form, 'FirstName', value === 'Make readonly');
                            }
                        }}
                        children={(field) => {
                            return <field.TextField />
                        }}
                    />
                </div>
                <div className={styles.row}>
                    <form.AppField 
                        name="Table1[0].Amount"
                        children={(field) => {
                            return <field.NumberField options={{ style: "currency" }} />
                        }}
                    />
                    <form.AppField 
                        name="Table1[0].StartDate"
                        children={field => <field.DatePicker />}
                    />
                </div>
                <div className={styles.row}>
                    <form.AppField 
                        name="AssignedTo"
                        children={field => <field.ComplexTagPicker limit={1} queryOptions={(query) => employeesQueryOptions({ query, directory: ['CENTRIC_BRANDS', 'CUSTOMERS'] })} />}
                    />
                </div>
                <div className={styles.row}>
                    <form.AppField 
                        // name="Table1[0].Fruits"
                        name="DropdownOption"
                        children={(field) => {
                            return <field.Dropdown 
                                multiselect
                            >
                                <Option value="Orange">Orange</Option>
                                <Option value="Apple">Apple</Option>
                                <Option>Banana</Option>
                            </field.Dropdown>
                        }}
                    />
                    <form.AppField 
                        name="ProgramItems"
                        children={field => (
                            <field.Combobox
                                multiselect
                            >
                                <Option value="741">741 IT Infrastructure</Option>
                                <Option value="742">742 Description</Option>
                                <Option value="743">743 Description</Option>
                            </field.Combobox>
                        )}
                    />
                </div>
                <div className={styles.row}>
                    <form.AppField 
                        name="Files"
                        validators={{
                            onSubmit: ({ value }) => {
                                return value.find(f => f.Field === 'File2') ? undefined : 'Required File2';
                            }
                        }}
                        children={field => {
                            return <field.FileField fields={['File1', 'File2']} />
                        }}
                    />
                    <form.AppField 
                        name="Table1[0].Document"
                        children={field => <field.FileField />}
                    />
                </div>
                <div className={styles.row}>
                    <form.AppField 
                        name="Table1[0].Attachments"
                        validators={{
                            onSubmit: ({ value }) => {
                                const fu = new URLSearchParams(value as string | null ?? '');
                                return fu.has('Name') ? undefined : ['is required', 'Attachments'];
                            }
                        }}
                        children={field => <field.FileField mode="zip" />}
                    />
                    <form.AppField 
                        name="Table1[0].Attachments2"
                        children={field => <field.FileField mode="zip" />}
                    />
                </div>
                <div className={styles.row}>
                    <form.AppField 
                        name="Table1[0].ChoiceGroup"
                        children={field => 
                            <field.RadioGroup>
                                <Radio value="Y" label="Yes" />
                                <Radio value="N" label="No" />
                            </field.RadioGroup>
                        }
                    />
                </div>
                <SectionDivider>Gridview example (Dialog)</SectionDivider>
                <div className={styles.row}>
                    <form.AppField 
                        name="SomeOtherTable"
                        mode="array"
                        validators={{
                            onSubmit: ({value}) => {
                                return value.length > 0 ? undefined : t('You need at least one item');
                            }
                        }}
                        children={(field) => {
                            return (
                                <field.DataGrid
                                    TableHeaderCellComponent={() => {
                                        return (<>
                                            <TableHeaderCell>{t('Field 1')}</TableHeaderCell>
                                            <TableHeaderCell>{t('Field 2')}</TableHeaderCell>
                                        </>);
                                    }}
                                    TableCellComponent={(props) => {
                                        const { item } = props;
                                        return (<>
                                            <TableCell>
                                                {item.Field1}
                                            </TableCell>
                                            <TableCell>
                                                {item.Field2}
                                            </TableCell>
                                        </>);
                                    }}
                                    defaultItem={{ Field1: 'Default Value', Field2: null }}
                                    detailsFormType="dialog"
                                    DetailsTitleComponent={(props) => {
                                        const { index } = props;
                                        return (
                                            <>This is the title {index}</>
                                        );
                                    }}
                                    DetailsBodyComponent={(props) => {
                                        const { form } = props;
                                        const inputFocusRef = useRef<HTMLInputElement>(null);
                                        useEffect(() => {
                                            if (inputFocusRef.current) {
                                                inputFocusRef.current.focus();
                                            }
                                        }, []);
                                        return (
                                            <>
                                                <form.AppField 
                                                    name="Field1"
                                                    validators={{
                                                        onSubmit: type("string > 0")
                                                    }}
                                                    children={(field) => <field.TextField input={{ ref: inputFocusRef }} />}
                                                />
                                                <form.AppField 
                                                    name="Field2"
                                                    children={(field) => <field.TextField />}
                                                />
                                            </>
                                        );
                                    }}
                                />
                            );
                            
                        }}
                    />
                </div>
                <SectionDivider>Gridview example (Drawer)</SectionDivider>
                <div className={styles.row}>
                    <form.AppField 
                        name="SomeOtherTable2"
                        mode="array"
                        children={(field) => {
                            return (
                                <field.DataGrid
                                    TableHeaderCellComponent={() => {
                                        return (<>
                                            <TableHeaderCell>{t('Field 1')}</TableHeaderCell>
                                            <TableHeaderCell>{t('Field 2')}</TableHeaderCell>
                                        </>);
                                    }}
                                    TableCellComponent={(props) => {
                                        const { item } = props;
                                        return (<>
                                            <TableCell>
                                                {item.Field1}
                                            </TableCell>
                                            <TableCell>
                                                {item.Field2}
                                            </TableCell>
                                        </>);
                                    }}
                                    defaultItem={{ Field1: 'Default Value', Field2: null }}
                                    detailsFormType="drawer"
                                    DetailsTitleComponent={(props) => {
                                        const { index } = props;
                                        return (
                                            <>This is the title {index}</>
                                        );
                                    }}
                                    DetailsBodyComponent={(props) => {
                                        const { form } = props;
                                        const inputFocusRef = useRef<HTMLInputElement>(null);
                                        useEffect(() => {
                                            if (inputFocusRef.current) {
                                                inputFocusRef.current.focus();
                                            }
                                        }, []);
                                        return (
                                            <>
                                                <form.AppField 
                                                    name="Field1"
                                                    validators={{
                                                        onSubmit: type("string > 0")
                                                    }}
                                                    children={(field) => <field.TextField input={{ ref: inputFocusRef }} />}
                                                />
                                                <form.AppField 
                                                    name="Field2"
                                                    validators={{
                                                        onSubmit: type("string > 0")
                                                    }}
                                                    children={(field) => <field.TextField />}
                                                />
                                            </>
                                        );
                                    }}
                                />
                            );
                            
                        }}
                    />
                </div>
                <SectionDivider>Gridview example (Inline)</SectionDivider>
                <div className={styles.row}>
                    <form.AppField 
                        name="SomeOtherTable3"
                        mode="array"
                        children={(field) => {
                            return (
                                <field.DataGrid
                                    TableHeaderCellComponent={() => {
                                        return (<>
                                            <TableHeaderCell>{t('Field 1')}</TableHeaderCell>
                                            <TableHeaderCell>{t('Field 2')}</TableHeaderCell>
                                        </>);
                                    }}
                                    TableCellComponent={(props) => {
                                        const { index } = props;
                                        return (<>
                                            <TableCell>
                                                <form.AppField 
                                                    name={`SomeOtherTable3[${index}].Field1`}
                                                    validators={{
                                                        onSubmit: type("string > 0")
                                                    }}
                                                    children={(field) => <field.TextField fieldProps={{ label: null }} />}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <form.AppField 
                                                    name={`SomeOtherTable3[${index}].Field2`}
                                                    validators={{
                                                        onSubmit: type("string > 0")
                                                    }}
                                                    children={(field) => <field.TextField fieldProps={{ label: null }} />}
                                                />
                                            </TableCell>
                                        </>);
                                    }}
                                    defaultItem={{ Field1: 'Default Value', Field2: null }}
                                    detailsFormType="inline"
                                />
                            );
                            
                        }}
                    />
                </div>
                <SectionDivider>Comments</SectionDivider>
                <div className={styles.row2}>
                    <form.AppField name="__Comments" mode="array" children={field => <field.NewCommentForm />} />
                </div>
                <div className={styles.row}>
                    <form.AppField name="__Comments" mode="array" children={field => <field.Comments />} />
                </div>
                <SectionDivider>Approvals</SectionDivider>
                <div className={styles.row}>
                    <form.AppField name="__Approvals" mode="array" children={field => <field.Approvals />} />
                </div>
            </FormContent>
            <FormFooter />
        </WfgFormProvider>
    );
}