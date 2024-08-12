import {IResultValueForm} from "../../types/forms";

export interface IResultValueModalProps {
    open: boolean,
    onClose?: () => void,
    onSubmit?: (values: IResultValueForm) => void,
    initialValues?: IResultValueForm,
    submitText?: string,
    titleText?: string,
    loading?: boolean
}