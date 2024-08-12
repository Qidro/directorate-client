import request from "./index";
import {IProject, IProjectDocument, IProjectFull} from "../types/project";
import {IRole, IUserRole} from "../types/role";
// import {IContractDocument} from "../types/contract";

class ProjectApi {
    getMyProjects = () => request.get<IProject[]>('/projects');
    getAllProjects = () => request.get<IProject[]>('/projects/all');

    getArchivedProjects = () => request.get<IProject[]>('/archive/projects')

    restoreProject = (project_id: number) => request.post<IProject>('/archive/project/unzip', {
        project_id
    })

    getProject = (projectId: string | number) => request.get<IProjectFull>('/project/'+projectId);

    getProjectRoles = () => request.get<IRole[]>('/project/roles');

    changeProjectStage = (project_id: string | number, status: string) => request.post<IProjectFull>('/project/stage/update', {
        project_id, status
    });

    update = (
        project_id: number,
        name: string,
        short_name: string,
        priority: string,
        type: string,
        description: string,
        formal_basis: string,
        project_justification: string,
        additional_info: string,
        project_goals: string,
        risks: string,
        deviations: string
    ) => {
        return request.post<IProjectFull>('/project/update', {
            project_id, name, short_name, priority, type, description, formal_basis, project_justification, additional_info, project_goals,
            risks, deviations
        })
    }

    addUserRole = (user_id: number, role_id: number, project_id: number) => request.post<IUserRole>('/project/user/role/add', {
        user_id, role_id, project_id
    })

    removeUserRole = (user_id: number, role_id: number, project_id: number) => request.delete('/project/user/role/remove', {
        user_id, role_id, project_id
    })

    uploadFile = (project_id: string, file: File, type: string) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('project_id', project_id)
        formData.append('type', type)

        return request.post<IProjectDocument>('/project/file/upload', formData)
    }

    removeFile = (project_id: number, file_id: string) => request.delete('/project/file/remove', {
        project_id, file_id
    })

    downloadPassport = (project_id: number) => request.getBlob<Blob>(`/generation/passport/${project_id}`);

    downloadPlan = (project_id: number) => request.getBlob<Blob>(`/generation/plan/${project_id}`);
}

export default new ProjectApi()