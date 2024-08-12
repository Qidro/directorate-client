import request from "./index";
import {IResourceCP, IResourceWorking} from "../types/resource";

class ResosurcesApi {
    getResourceWorking = (projectId: string | number) => request.get<IResourceWorking[]>(`/project/${projectId}/resource_working`)

    getResourceCP = (projectId: string | number) => request.get<IResourceCP[]>(`/project/${projectId}/resource_cp`)
}

export default new ResosurcesApi()