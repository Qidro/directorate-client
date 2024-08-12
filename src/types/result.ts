import {IUserRole} from "./role";

export type ResultStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ACHIEVED' | 'CANCELED'

export interface IResult {
    id: number,
    project: {
        id: string | number,
        name: string,
    },
    name: string,
    type: string,
    units_measure: string,
    characteristic: string,
    approval_doc: string,
    status: ResultStatus,
    users: IUserRole[],
}

export interface IResultValue {
    id: number,
    achievement_date: string,
    plan: number,
    forecast: number,
    units_measure: string,
    result: {
        id: number,
        name: string
    }
}

export interface IMiniResult {
    id: number,
    name: string,
    status: string
}