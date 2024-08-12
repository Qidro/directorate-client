import {IProject} from "./project";
import {ICalendarPlan} from "./calendarPlan";

export interface IDashboardCommon {
    projects: IProject[];
    calendar_plan: ICalendarPlan[]
}

export interface IDashboardAdvanced {
    project_count: number;
    backpack_count: number;
    proposal_count: number;
    proposal_count_list: {
        success: number;
        reject: number;
        archived: number;
    };
    project_count_list: {
        initiation: number;
        preparation: number;
        realization: number;
        completion: number;
        post_project_monitoring: number;
        archived: number;
        canceled: number;
    };
}