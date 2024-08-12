import {ICalendarPlanResult} from "../../types/calendarPlan";

export interface ICalendarPlanResultModalProps {
    open: boolean,
    onClose?: () => void,
    onSelect?: (calendar_plan_id: number, result_id: number) => void,
    onDeselect?: (calendar_plan_id: number, result_id: number) => void,
    initialValues?: ICalendarPlanResult[],
    loadingField: boolean
}