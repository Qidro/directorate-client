import {IProposalForm} from "../../types/forms";

export interface IProposalModalProps {
    open: boolean,
    onClose?: () => void,
    onSubmit?: (values: IProposalForm) => void,
    initialValues?: IProposalForm,
    submitText?: string,
    titleText?: string,
    loading?: boolean
}