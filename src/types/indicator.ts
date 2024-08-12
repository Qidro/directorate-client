import {IUserRole} from "./role";

export interface IProjectIndicator {
    id: number,
    project: {
        id: string | number,
        name: string,
    },
    name: string,
    evaluation_type: string,
    evaluation_frequency: string,
    units_measure: string,
    base_value: string,
    base_value_date: any,
    plan_value: string,
    forecast_value: string,
    actual_value: string,
    description: string,
    info_collection: string,
    coverage_units: string,
    approval_doc: string,
    status: string,
    users: IUserRole[],
    indicator_values?: IIndicatorValue[]
}

export interface IIndicatorValue {
    id: number,
    period: string,
    plan_value: number,
    forecast_value: number,
    actual_value: number,
    status: string,
}