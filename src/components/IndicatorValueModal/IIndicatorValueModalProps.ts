import {IIndicatorValueForm} from "../../types/forms";

export interface IIndicatorValueModalProps {
    open: boolean,
    onClose: () => void,
    onSubmit?: (values: IIndicatorValueForm) => void,
    initialValues?: IIndicatorValueForm,
    submitText?: string,
    titleText?: string,
    loading?: boolean
}