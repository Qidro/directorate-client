import {IContractForm} from "../../types/forms";

export interface IContractModalProps {
    open: boolean,
    onClose?: () => void,
    onSubmit?: (values: IContractForm) => void,
    initialValues?: IContractForm,
    submitText?: string,
    titleText?: string,
    loading?: boolean
}