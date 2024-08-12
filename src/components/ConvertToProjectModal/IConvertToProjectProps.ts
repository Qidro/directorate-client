import {IConvertToProjectForm} from "../../types/forms";

export interface IConvertToProjectProps {
    open: boolean,
    onClose: () => void,
    onSubmit: (values: IConvertToProjectForm) => void,
    submitText: string,
    loading: boolean,
}