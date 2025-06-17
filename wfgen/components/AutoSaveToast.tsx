import { Link, Spinner, Toast, ToastBody, ToastTitle, ToastTrigger, useId, useToastController, Text, Toaster } from "@fluentui/react-components";
import { useCallback, useState } from "react";
import { skipToken, useIsMutating, useMutation, useQuery } from "@tanstack/react-query";
import { postWithFormData } from "@wfgen/utils";
import { useTranslation } from "react-i18next";
import { useWfgFormContext } from "@wfgen/hooks/useWfgFormContext";
import type { WfgFormData } from "@wfgen/types";
import type { AxiosRequestConfig } from "axios";

export const AutoSaveToast = (props: { autoSaveInterval?: number }) => {
    const { autoSaveInterval: defaultAutoSaveInterval = 60 * 1000 } = props;
    const { t } = useTranslation();
    const { form } = useWfgFormContext();
    const [autoSaveInterval, setAutoSaveInterval] = useState(defaultAutoSaveInterval);
    const toasterId = useId("toaster");
    const toastId = useId("toast");
    const { dispatchToast, dismissToast } = useToastController(toasterId);
    const dismiss = useCallback(() => dismissToast(toastId), [dismissToast, toastId]);
    const isMutating = useIsMutating({ mutationKey: ['save'] }) > 0;
    const key = ['autosave'];
    const { mutateAsync } = useMutation({
        mutationKey: key,
        mutationFn: async (ctx: { formData: WfgFormData, config?: AxiosRequestConfig<FormData> }) => {
            const res = await postWithFormData(ctx);
            return res.data;
        },
        onMutate: () => dispatchToast(
            <Toast>
                <ToastTitle 
                    media={<Spinner size="extra-tiny" />}
                    action={<ToastTrigger><Link>{t('Dismiss')}</Link></ToastTrigger>}
                >
                    {t('Saving...')}
                </ToastTitle>
                <ToastBody>
                    <Text>{t('Auto saving the form')}</Text>
                </ToastBody>
            </Toast>,
            {
                timeout: -1,
                toastId
            }
        ),
        onSettled: (_, error) => {
            if (error) {
                setAutoSaveInterval(-1);
            }
            dismiss();
        }
    });
    useQuery({
        queryKey: key,
        queryFn: isMutating || autoSaveInterval <= 0 ? skipToken : ({ signal }) => {
            form.state.values.Table1[0].FORM_ACTION = 'ASYNC_SAVE';
            return mutateAsync({ formData: form.state.values, config: { signal } });
        },
        initialData: { replyTo: 'InitialData' },
        staleTime: Infinity,
        refetchInterval: autoSaveInterval,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false
    });

    return <Toaster toasterId={toasterId} />;
};