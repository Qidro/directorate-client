import request from "./index";
import {IResult, IResultValue} from "../types/result";
import {IRole, IUserRole} from "../types/role";

class ResultApi {
    create = (
        project_id: number,
        name: string,
        type: string,
        units_measure: string,
        characteristic: string,
        approval_doc: string,
    ) => request.post<IResult>('/project/result/create', {
        project_id, name, type, units_measure, characteristic, approval_doc
    })

    update = (
        result_id: number,
        name: string,
        type: string,
        units_measure: string,
        characteristic: string,
        approval_doc: string,
        status: string,
    ) => request.post<IResult>('/project/result/edit', {
        result_id, name, type, units_measure, characteristic, approval_doc, status
    })

    getById = (id: number | string) => request.get<IResult>('/project/result/' + id)

    getByProject = (projectId: number | string) => request.get<IResult[]>(`/project/${projectId}/results`)

    remove = (resultId: number) => request.delete('/project/result/remove', {
        result_id: resultId
    })

    getRoles = () => request.get<IRole[]>('/project/result/roles')

    addUserRole = (user_id: number, role_id: number, project_result_id: number) =>
        request.post<IUserRole>('/project/result/user/role/add', {
            user_id, role_id, project_result_id
        })

    removeUserRole = (user_id: number, role_id: number, project_result_id: number) =>
        request.delete('/project/result/user/role/remove', {
            user_id, role_id, project_result_id
        })

    createValue = (
        result_id: number,
        achievement_date: string,
        plan_value: number,
        forecast_value: number
    ) => request.post<IResultValue>('/project/result/value/add', {
        result_id, achievement_date, plan_value, forecast_value
    })

    updateValue = (
        value_id: number,
        achievement_date: string,
        plan_value: number,
        forecast_value: number
    ) => request.post<IResultValue>('/project/result/value/update', {
        value_id, achievement_date, plan_value, forecast_value
    })

    getValues = (resultId: string | number) => request.get<IResultValue[]>('/project/result/' + resultId + '/values/')

    removeValue = (value_id: number) => request.delete('/project/result/value/remove', {
        value_id
    })
}

export default new ResultApi()