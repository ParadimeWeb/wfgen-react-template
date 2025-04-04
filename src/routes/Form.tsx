import { makeStyles, Option, Radio } from "@fluentui/react-components";
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
                        children={field => <field.ComplexTagPicker queryOptions={employeesQueryOptions} />}
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
                        name="Table1[0].File1"
                        children={field => <field.FileField otherFields={['File2']} />}
                    />
                    <form.AppField 
                        name="Table1[0].Document"
                        validators={{
                            onSubmit: ({ value }) => {
                                const file = value as string | null;
                                const fu = new URLSearchParams(file ?? '');
                                return fu.has('Name') ? undefined : ['is required', 'File 4'];
                            }
                        }}
                        children={field => <field.FileField />}
                    />
                </div>
                <div className={styles.row}>
                    <form.AppField 
                        name="Table1[0].Attachments"
                        children={field => <field.FileField mode="zip" />}
                    />
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
            </FormContent>
            <FormFooter />
        </WfgFormProvider>
    );
}