import {makeAutoObservable} from "mobx";
import {IProjectFull} from "../types/project";
import ProjectApi from "../api/project-api";
import {IProjectForm} from "../types/forms";
import {IRole} from "../types/role";

export class Project {
    constructor() {
        makeAutoObservable(this)
    }

    project: IProjectFull = {} as IProjectFull
    setProjectInformation = (data: IProjectFull) => this.project = data

    roles: IRole[] = []
    setRoles = (roles: IRole[]) => this.roles = roles

    editOpen: boolean = false
    setEditOpen = (state: boolean) => this.editOpen = state

    editable: boolean = true
    setEditable = (state: boolean) => this.editable = state

    getProject = async (projectId: string | number) => {
        this.setProjectInformation({} as IProjectFull);

        const res = await ProjectApi.getProject(projectId);

        if (['REALIZATION', 'COMPLETION', 'POST_PROJECT_MONITORING', 'ARCHIVED', 'CANCELED'].includes(res.data.status)) this.setEditable(false)

        this.setProjectInformation(res.data);
        return res;
    }

    getRoles = async () => {
        const res = await ProjectApi.getProjectRoles();
        this.setRoles(res.data);

        return res
    }

    updateProject = async (data: IProjectForm) => {
        const res = await ProjectApi.update(
            this.project.id,
            data.name,
            data.short_name,
            data.priority,
            data.type,
            data.description,
            data.formal_basis,
            data.project_justification,
            data.additional_info,
            data.project_goals,
            data.risks,
            data.deviations,
        );

        this.setProjectInformation(res.data);

        return res
    }

    addUserRole = async (userId: number, roleId: number) => {
        const res = await ProjectApi.addUserRole(userId, roleId, this.project.id);

        this.setProjectInformation({
            ...this.project,
            users: [...this.project.users, res.data]
        });

        return res
    }

    removeUserRole = async (userId: number, roleId: number) => {
        const res = await ProjectApi.removeUserRole(userId, roleId, this.project.id);

        this.setProjectInformation({
            ...this.project,
            users: this.project.users.filter(user => user.id !== userId || user.role.id !== roleId)
        });

        return res
    }

    uploadDocument = async (file: File, type: string) => {
        const res = await ProjectApi.uploadFile(this.project.id.toString(), file, type)

        this.setProjectInformation({
            ...this.project,
            documents: [...this.project.documents, res.data]
        })

        return res
    }

    removeDocument = async (file_id: string) => {
        await ProjectApi.removeFile(this.project.id, file_id)

        this.setProjectInformation({
            ...this.project,
            documents: this.project.documents.filter(item => item.file_id !== file_id)
        })
    }

    checkDocument = async (type: string) => {
        return !!this.project.documents.find(document => document.type === type)
    }

    getDocumentTypeByStage = async (stage: string) => {
        let type = '';
        if (stage === 'PREPARATION') type = 'PASSPORT'
        if (stage === 'REALIZATION') type = 'PLAN'
        if (stage === 'COMPLETION') type = 'WORK_PLAN'
        if (stage === 'POST_PROJECT_MONITORING') type = 'FINAL_REPORT'

        return type
    }
}