import request from "./index";
import {
    IBackPackLog,
    ICalendarPlanLog, IContractLog,
    IIndicatorLog,
    IProjectLog,
    IProposalLog,
    IResultLog,
    IUserLog
} from "../types/logs";

class LogsApi {
    getUserLogs = (user_id: number, position: number) => (
        request.get<IUserLog[]>(`/user/${user_id}/logs&position=${position}`)
    )

    getProposalLogs = (proposal_id: number, position: number) => (
        request.get<IProposalLog[]>(`/proposal/${proposal_id}/logs&position=${position}`)
    )

    getBackpackLogs = (backpack_id: number, position: number) => (
        request.get<IBackPackLog[]>(`/backpack/${backpack_id}/logs&position=${position}`)
    )

    getProjectLogs = (project_id: number, position: number) => (
        request.get<IProjectLog[]>(`/project/${project_id}/logs&position=${position}`)
    )

    getIndicatorLogs = (indicator_id: number, position: number) => (
        request.get<IIndicatorLog[]>(`/project/indicator/${indicator_id}/logs&position=${position}`)
    )

    getResultLogs = (result_id: number, position: number) => (
        request.get<IResultLog[]>(`/project/result/${result_id}/logs&position=${position}`)
    )

    getCalendarPlanLogs = (cp_id: number, position: number) => (
        request.get<ICalendarPlanLog[]>(`/project/calendar_plan/${cp_id}/logs&position=${position}`)
    )

    getContractLogs = (contract_id: number, position: number) => (
        request.get<IContractLog[]>(`/project/contract/${contract_id}/logs&position=${position}`)
    )
}

export default new LogsApi()