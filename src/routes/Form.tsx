import { Field, InteractionTag, InteractionTagPrimary, InteractionTagSecondary, Link, makeStyles, Option, ProgressBar, Radio } from "@fluentui/react-components";
import { styleHelpers } from "../styles";
import { FormFooter } from "../components/Form/Footer";
import { employeesQueryOptions } from "../queryOptions";
import { useWfgPrintForm, useWfgForm } from "../hooks/useWfgForm";
import { WfgFormProvider } from "../components/Form/Provider";
import { FormHeader } from "../components/Form/Header";
import { FormContent } from "../components/Form/Content";
import { type } from "arktype";
import { csvToSet, setToCsv } from "../utils";
import type { Table1 } from "../types";
import { FileTypeIcon } from "../components/FormFields/FileField/FileTypeIcon";

const useStyles = makeStyles({
    row: styleHelpers.row(),
});

export function Form() {
    const styles = useStyles();
    const form = useWfgForm();
    const printForm = useWfgPrintForm();
    
    return (
        <WfgFormProvider ctx={{ form, printForm }} autoSaveInterval={60000}>
            <FormHeader />
            <FormContent>
                <div className={styles.row}>
                    <form.AppField 
                        name="Table1[0].FirstName"
                        validators={{
                            onSubmit: type("string > 3")
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
                                form.setFieldValue('Table1[0].FORM_FIELDS_READONLY', v => {
                                    const FORM_FIELDS_READONLY = v as Table1['FORM_FIELDS_READONLY'];
                                    const set = csvToSet(FORM_FIELDS_READONLY ?? '');
                                    if (value === 'Make readonly') {
                                        set.add('FirstName');
                                    }
                                    else {
                                        set.delete('FirstName');
                                    }
                                    return setToCsv(set);
                                });
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
                            return <field.NumberField style="currency" />
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
                                console.log('onSubmit', value);
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
                    
                    <InteractionTag
                        disabled={false}
                        appearance="outline"
                        style={{ position: 'relative' }}
                    >
                        <InteractionTagPrimary
                            hasSecondaryAction
                            icon={<FileTypeIcon fileName="name.pdf" size={20} />}
                        >
                            This is the file name.pdf
                        </InteractionTagPrimary>
                        <InteractionTagSecondary />
                        <ProgressBar style={{ position: 'absolute', bottom: 0, borderTopLeftRadius: 'unset', borderTopRightRadius: 'unset' }} bar={{ style: { borderTopRightRadius: '4px' } }} color="success" thickness="large" value={0.75} />
                    </InteractionTag>
                </div>
            </FormContent>
            <FormFooter />
        </WfgFormProvider>
    );
}