import {IProjectForm} from "../../types/forms";

export interface IProjectModalProps {
    open: boolean,
    onClose?: () => void,
    onSubmit?: (values: IProjectForm) => void,
    initialValues?: IProjectForm,
    submitText?: string,
    titleText?: string,
    loading?: boolean
}