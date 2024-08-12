import request from "./index";
import {IIndicatorValue, IProjectIndicator} from "../types/indicator";
import {IRole, IUserRole} from "../types/role";

class IndicatorApi {
    getIndicators = (projectId: string) => request.get<IProjectIndicator[]>(`/project/${projectId}/indicators`)

    getIndicator = (indicatorId: string) => request.get<IProjectIndicator>(`/project/indicator/${indicatorId}`)

    add = (
        project_id: number,
        name: string,
        evaluation_type: string,
        evaluation_frequency: string,
        units_measure: string,
        base_value: string,
        base_value_date: string | null,
        description: string,
        info_collection: string,
        coverage_units: string,
        approval_doc: string,
    ) => request.post<IProjectIndicator>('/project/indicator/create', {
        project_id, name, evaluation_type, evaluation_frequency, units_measure, base_value, base_value_date,
        description, info_collection, coverage_units, approval_doc
    })

    update = (
        indicator_id: number,
        name: string,
        evaluation_type: string,
        evaluation_frequency: string,
        units_measure: string,
        base_value: string,
        base_value_date: string | null,
        description: string,
        info_collection: string,
        coverage_units: string,
        approval_doc: string,
    ) => request.post<IProjectIndicator>('/project/indicator/update', {
        indicator_id, name, evaluation_type, evaluation_frequency, units_measure, base_value, base_value_date,
        description, info_collection, coverage_units, approval_doc
    })

    delete = (indicator_id: number) => request.delete('/project/indicator/delete', {
        indicator_id
    })

    getIndicatorRoles = () => request.get<IRole[]>('/project/indicator/roles')

    addUserRole = (user_id: number, indicator_role_id: number, indicator_id: number) =>
        request.post<IUserRole>('/project/indicator/user/role/add', {
        user_id, indicator_role_id, indicator_id
    })

    removeUserRole = (user_id: number, indicator_role_id: number, indicator_id: number) =>
        request.delete('/project/indicator/user/role/remove', {
        user_id, indicator_role_id, indicator_id
    })

    addIndicatorValue = (indicator_id: number, period: string,
                         plan_value: number, forecast_value: number | string, actual_value: number | string) =>
        request.post<IIndicatorValue>('/project/indicator/value/create', {
            indicator_id, period, plan_value, forecast_value, actual_value
        });

    updateIndicatorValue = (indicator_value_id: number, period: string,
                         plan_value: number, forecast_value: number | string, actual_value: number | string) =>
        request.post<IIndicatorValue>('/project/indicator/value/update', {
            indicator_value_id, period, plan_value, forecast_value, actual_value
        });

    deleteIndicatorValue = (indicator_value_id: number) =>
        request.delete('/project/indicator/value/delete', {indicator_value_id});

    getIndicatorValue = (indicatorValueId: number) => request.get<IIndicatorValue>('/project/indicator/value/'+indicatorValueId)
}

export default new IndicatorApi();