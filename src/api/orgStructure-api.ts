import request from "./index";
import {Department, Position} from "../types/orgStructure";

class OrgStructureApi {
    getDepartments = () => request.get<Department[]>('/org_structure/departments')
    getPositions = () => request.get<Position[]>('/org_structure/positions')
    getDepartment = (id: number) => request.get<Department>('/org_structure/department/'+id)
    getPosition = (id: number) => request.get<Position>('/org_structure/position/'+id)

    createDepartment = (name: string) => {
        return request.post<Department>('/org_structure/department/create', {
            name
        });

    };

    editDepartment = (id: number, name: string) => {
        return request.post<Department>('/org_structure/department/edit', {
            id, name
        });
    };

    deleteDepartment = (id: number) => {
        return request.delete('/org_structure/department/delete', {
            id
        });
    };

    createPosition = (name: string, department_id: number) => {
        return request.post<Position>('/org_structure/position/create', {
            name, department_id
        });
    };

    editPosition = (id: number, name: string) => {
        return request.post<Position>('/org_structure/position/edit', {
            id, name
        });
    };

    deletePosition = (id: number) => {
        return request.delete('/org_structure/position/delete', {
            id
        });
    };
}

export default new OrgStructureApi();