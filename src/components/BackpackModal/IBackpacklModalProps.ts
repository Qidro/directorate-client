import {IBackpackForm} from "../../types/forms";

export interface IBackpacklModalProps {
    open: boolean,
    onClose: () => void,
    onSubmit: (values: IBackpackForm) => void,
    initialValues?: IBackpackForm,
    loading: boolean
}