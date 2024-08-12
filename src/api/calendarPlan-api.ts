import request from "./index";
import {ICalendarPlan, ICalendarPlanCP, ICalendarPlanResult} from "../types/calendarPlan";
import {IRole, IUserRole} from "../types/role";


class CalendarPlanApi {
    getPlans = (projectId: string | number) => request.get<ICalendarPlan[]>(`/project/${projectId}/calendar_plans`)

    getPlan = (calendarPlanId: string | number) => request.get<ICalendarPlan>(`/project/calendar_plan/${calendarPlanId}`)

    getStages = (projectId: string | number) => request.get<ICalendarPlan[]>(`/project/${projectId}/calendar_plan/stages`)

    createStage = (project_id: number,
                   type: string,
                   name: string,
                   awaiting_result: string
    ) => request.post<ICalendarPlan>('/project/calendar_plan/stage/create', {
        project_id, type, name, awaiting_result
    })

    createWork = (project_id: number,
                  type: string,
                  name: string,
                  awaiting_result: string,
                  start_date_plan: any,
                  start_date_forecast: any,
                  start_date_fact: any,
                  end_date_plan: any,
                  end_date_forecast: any,
                  end_date_fact: any,
                  executor_id: number,
                  approval_doc: string,
                  parent_stage_id: number
    ) => request.post<ICalendarPlan>('/project/calendar_plan/work/create', {
        project_id, type, name, awaiting_result, start_date_plan, start_date_forecast, start_date_fact, end_date_plan,
        end_date_forecast, end_date_fact, executor_id, approval_doc, parent_stage_id
    })

    createPoint = (project_id: number,
                   type: string,
                   name: string,
                   end_date_plan: any,
                   end_date_forecast: any,
                   end_date_fact: any,
                   executor_id: number,
                   approval_doc: string
    ) => request.post<ICalendarPlan>('/project/calendar_plan/point/create', {
        project_id, type, name, end_date_plan, end_date_forecast, end_date_fact, executor_id, approval_doc
    })

    updateWork = (calendar_plan_id: number,
                  type: string,
                  name: string,
                  awaiting_result: string,
                  start_date_plan: any,
                  start_date_forecast: any,
                  start_date_fact: any,
                  end_date_plan: any,
                  end_date_forecast: any,
                  end_date_fact: any,
                  approval_doc: string,
                  parent_stage_id: number
    ) => request.post<ICalendarPlan>('/project/calendar_plan/work/update', {
        calendar_plan_id, type, name, awaiting_result, start_date_plan, start_date_forecast, start_date_fact,
        end_date_plan, end_date_forecast, end_date_fact, approval_doc, parent_stage_id
    })

    updatePoint = (calendar_plan_id: number,
              type: string,
              name: string,
              end_date_plan: any,
              end_date_forecast: any,
              end_date_fact: any,
              approval_doc: string
    ) => request.post<ICalendarPlan>('/project/calendar_plan/point/update', {
        calendar_plan_id, type, name, end_date_plan, end_date_forecast, end_date_fact, approval_doc
    })

    updateStage = (calendar_plan_id: number,
                   type: string,
                   name: string,
                   awaiting_result: string,
    ) => request.post<ICalendarPlan>('/project/calendar_plan/stage/update', {
        calendar_plan_id, type, name, awaiting_result
    })

    addResult = (calendar_plan_id: number, result_id: number) =>
        request.post<ICalendarPlanResult>('/project/calendar_plan/result/add', {calendar_plan_id, result_id})

    removeResult = (calendar_plan_id: number, result_id: number) =>
        request.delete('/project/calendar_plan/result/remove', {calendar_plan_id, result_id})

    delete = (calendar_plan_id: number) => request.delete('/project/calendar_plan/delete',
        {calendar_plan_id})

    getCP = () => request.get<ICalendarPlanCP[]>('/project/calendar_plan/cp')

    getRoles = () => request.get<IRole[]>('/project/calendar_plan/roles')

    addUserRole = (user_id: number, role_id: number, calendar_plan_id: number) =>
        request.post<IUserRole>('/project/calendar_plan/user/role/add', {user_id, calendar_plan_id, role_id})

    removeUserRole = (user_id: number, role_id: number, calendar_plan_id: number) =>
        request.delete('/project/calendar_plan/user/role/remove', {user_id, calendar_plan_id, role_id})

    updateStatus = (calendar_plan_id: number, status: string) =>
        request.post<ICalendarPlan>('/project/calendar_plan/status/update', {calendar_plan_id, status})
}

export default new CalendarPlanApi()