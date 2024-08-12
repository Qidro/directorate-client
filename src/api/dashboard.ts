import request from "./index";
import {IDashboardAdvanced, IDashboardCommon} from "../types/dashboard";

class DashboardApi {
    getCommon = (startDate: string, endDate: string) => {
        return request.get<IDashboardCommon>(`/dashboard/${startDate}_${endDate}/common`)
    }

    getAdvanced = (startDate: string, endDate: string) => {
        return request.get<IDashboardAdvanced>(`/dashboard/${startDate}_${endDate}/advanced`)
    }
}

export default new DashboardApi()