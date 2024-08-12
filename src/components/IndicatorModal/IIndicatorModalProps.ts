import {IIndicatorForm} from "../../types/forms";

export interface IIndicatorModalProps {
    open: boolean,
    onClose?: () => void,
    onSubmit?: (values: IIndicatorForm) => void,
    initialValues?: IIndicatorForm,
    submitText?: string,
    titleText?: string,
    loading?: boolean
}