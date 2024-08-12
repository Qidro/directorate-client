import {IUserRole} from "./role";

export interface IProject {
    id: number,
    backpack: {
        id: number,
        name: string,
        description: string
    },
    name: string,
    short_name: string,
    priority: string,
    type: string,
    start_date: string,
    end_date: string,
    description: string,
    formal_basis: string,
    project_justification: string,
    additional_info: string,
    project_goals: string,
    risks: string,
    deviations: string,
    creation_date: string,
    last_change_date: string,
    status: 'INITIATION' | 'PREPARATION' | 'REALIZATION' | 'COMPLETION' | 'POST_PROJECT_MONITORING' | 'ARCHIVED' | 'CANCELED',
    isArchived: boolean,
    users: IUserRole[],
    proposal_id: string | number
}

export interface IProjectFull extends IProject {
    documents: IProjectDocument[]
}

export interface IProjectDocument {
    file_id: string,
    filename: string,
    type: FileTypes,
}

export type FileTypes = 'OTHER' | 'JUSTIFICATION' | 'PASSPORT' | 'PLAN' | 'WORK_PLAN' | 'ACCEPTANCE_ACTS' | 'FINAL_REPORT' | 'ACHIEVEMENT_PLAN' | 'STAGE_DOCUMENTS'