import {makeAutoObservable} from "mobx";
import {IRole} from "../types/role";
import {calendarPlanStatus, ICalendarPlan} from "../types/calendarPlan";
import CalendarPlanApi from "../api/calendarPlan-api";
import {ICalendarPlanForm} from "../types/forms";
import {getDate} from "../utils/getDate";

export class CalendarPlan {
    constructor() {
        makeAutoObservable(this);
    }

    calendarPlan: ICalendarPlan = {} as ICalendarPlan;
    setCalendarPlanInformation = (data: ICalendarPlan) => this.calendarPlan = data;

    roles: IRole[] = [];
    setRoles = (roles: IRole[]) => this.roles = roles;


    getCalendarPlan = async (calendarPlanId: string) => {
        this.setCalendarPlanInformation({} as ICalendarPlan);

        const res = await CalendarPlanApi.getPlan(calendarPlanId);

        this.setCalendarPlanInformation(res.data);

        return res;
    }

    getRoles = async () => {
        const res = await CalendarPlanApi.getRoles();

        this.setRoles(res.data);

        return res;
    }

    addUserRole = async (userId: number, roleId: number) => {
        const res = await CalendarPlanApi.addUserRole(userId, roleId, this.calendarPlan.id)

        this.setCalendarPlanInformation({
            ...this.calendarPlan,
            users: [...this.calendarPlan.users, res.data]
        });

        return res;
    }

    removeUserRole = async (userId: number, roleId: number) => {
        const res = await CalendarPlanApi.removeUserRole(userId, roleId, this.calendarPlan.id)

        this.setCalendarPlanInformation({
            ...this.calendarPlan,
            users: this.calendarPlan.users.filter(user => user.id !== userId || user.role.id !== roleId)
        });

        return res;
    }

    updateWork = async (data: ICalendarPlanForm) => {
        const res = await CalendarPlanApi.updateWork(
            this.calendarPlan.id, data.type, data.name, data.awaiting_result, getDate(data.start_date_plan),
            getDate(data.start_date_forecast), getDate(data.start_date_fact), getDate(data.end_date_plan),
            getDate(data.end_date_forecast), getDate(data.end_date_fact), data.approval_doc!, data.parent_stage_id!);

        this.setCalendarPlanInformation({...res.data, results: this.calendarPlan.results});

        return res;
    }

    updatePoint = async (data: ICalendarPlanForm) => {
        const res = await CalendarPlanApi.updatePoint(
            this.calendarPlan.id, data.type, data.name, getDate(data.end_date), getDate(data.end_date), getDate(data.end_date), data.approval_doc!);

        this.setCalendarPlanInformation({...res.data, results: this.calendarPlan.results});

        return res;
    }

    updateStage = async (data: ICalendarPlanForm) => {
        console.log(data)
        const res = await CalendarPlanApi.updateStage(
            this.calendarPlan.id, data.type, data.name, data.awaiting_result
        )

        this.setCalendarPlanInformation(res.data);

        return res;
    }

    addResult = async (calendar_plan_id: number, result_id: number) => {
        const res = await CalendarPlanApi.addResult(calendar_plan_id, result_id);

        this.setCalendarPlanInformation({
            ...this.calendarPlan,
            results: [...this.calendarPlan.results!, res.data]
        });

        return res;
    }

    removeResult = async (calendar_plan_id: number, result_id: number) => {
        const res = await CalendarPlanApi.removeResult(calendar_plan_id, result_id);

        this.setCalendarPlanInformation({
            ...this.calendarPlan,
            results: this.calendarPlan.results?.filter(result => result.result.id !== result_id)
        });

        return res
    }

    updateStatus = async (calendar_plan_id: number, status: calendarPlanStatus) => {
        const res = await CalendarPlanApi.updateStatus(calendar_plan_id, status);

        this.setCalendarPlanInformation({
            ...this.calendarPlan,
            status: status
        })

        return res
    }
}