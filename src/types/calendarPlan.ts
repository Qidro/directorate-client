import {IUserRole} from "./role";
import {IMiniResult} from "./result";

export type calendarPlanStatus = 'IN_WORK' | 'COMPLETE' | 'CONFIRMED' | 'OVERDUE' | 'FORECAST_FAILURE'

export interface ICalendarPlan {
    id: number,
    project: {
        id: number,
        name: string,
    },
    type: string,
    name: string,
    awaiting_result: string,
    start_date_plan: any,
    start_date_forecast: any,
    start_date_fact: any,
    length_of_days?: number,
    working_days?: number,
    end_date_plan: any,
    end_date_forecast: any,
    end_date_fact: any,
    approval_doc: string,
    status: calendarPlanStatus,
    users: IUserRole[],
    results?: ICalendarPlanResult[],
    children?: ICalendarPlan[]
}

export interface ICalendarPlanCP {
    id: number,
    slug: string,
    name: string,
    description: string,
}

export interface ICalendarPlanResult {
    id: number
    calendar_plan_id: number,
    result: IMiniResult,
}
