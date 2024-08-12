import {IUserRole} from "./role";
import {IProjectIndicator} from "./indicator";
import {ICalendarPlan} from "./calendarPlan";
import {IBudget} from "./budget";

export interface IBackpack {
    id: number,
    name: string,
    description: string,
    creation_date: any,
    change_date: any,
    users: IUserRole[]
}

interface IBackpackProject {
    id: number,
    name: string,
    status: 'INITIATION' | 'PREPARATION' | 'REALIZATION' | 'COMPLETION' | 'POST_PROJECT_MONITORING' | 'ARCHIVED' | 'CANCELED'
}

export interface IBackpackProjectIndicator extends IBackpackProject {
    indicators: IProjectIndicator[]
}

export interface IBackpackProjectCalendarPlan extends IBackpackProject {
    calendar_plans: ICalendarPlan[]
}

export interface IBackpackProjectBudget extends IBackpackProject {
    budgets: IBudget[]
}