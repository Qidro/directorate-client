import {IResultForm} from "../../types/forms";

export interface IResultModalProps {
    open: boolean,
    onClose?: () => void,
    onSubmit?: (values: IResultForm) => void,
    initialValues?: IResultForm,
    submitText?: string,
    titleText?: string,
    loading?: boolean
}