import {IBudgetForm} from "../../types/forms";

export interface IBudgetModalProps {
    open: boolean,
    onClose: () => void,
    onSubmit: (values: IBudgetForm) => void,
    initialValues?: IBudgetForm,
    submitText: string,
    titleText: string,
    loading: boolean
}