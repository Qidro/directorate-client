import {ICalendarPlanForm} from "../../types/forms";

export interface IProjectCalendarPlanModal {
    open: boolean,
    onClose: () => void,
    onSubmit: (values: ICalendarPlanForm) => void,
    initialValues?: ICalendarPlanForm,
    submitText?: string,
    titleText?: string,
    loading: boolean
}