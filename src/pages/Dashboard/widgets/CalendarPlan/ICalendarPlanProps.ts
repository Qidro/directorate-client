import {ICalendarPlan} from "../../../../types/calendarPlan";

export interface ICalendarPlanProps {
    calendarPlans: ICalendarPlan[],
    loading?: boolean,
    verticalScroll?: number
}