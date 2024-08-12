import request from "./index";
import {IContractDocument, IProjectContract, IProjectContractFull} from "../types/contract";
import {IRole, IUserRole} from "../types/role";

class ContractApi {
    getContracts = (projectId: string) => request.get<IProjectContract[]>(`/project/${projectId}/contracts`)

    add = (
        project_id: number,
        name: string,
        type: string,
        federal_law: string,
        planned_cost: number,
        cost?: number,
        paid?: number,
        description?: string,
        link?: string
    ) => request.post<IProjectContract>('/project/contract/create', {
        project_id, name, type, federal_law, planned_cost, cost, paid, description, link
    })

    update = (
        contract_id: number,
        name: string,
        type: string,
        federal_law: string,
        planned_cost: number,
        cost?: number,
        paid?: number,
        description?: string,
        link?: string
    ) => request.post<IProjectContractFull>('/project/contract/edit', {
        contract_id, name, type, federal_law, planned_cost, cost, paid, description, link
    })

    delete = (contract_id: number) => request.delete('/project/contract/remove', {
        contract_id
    })

    getContract = (contractId: string) => request.get<IProjectContractFull>('/project/contract/'+contractId)

    getRoles = () => request.get<IRole[]>('/project/contracts/roles')

    changeStage = (contract_id: number, status: string) => request.post<IProjectContractFull>('/project/contract/stage/edit', {
        contract_id, status
    })

    addUserRole = (user_id: number, role_id: number, contract_id: number) => request.post<IUserRole>('/project/contract/user/role/add', {
        user_id, role_id, contract_id
    })

    removeUserRole = (user_id: number, role_id: number, contract_id: number) => request.delete<IUserRole>('/project/contract/user/role/remove', {
        user_id, role_id, contract_id
    })

    uploadFile = (contract_id: string, file: File, type: string) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('contract_id', contract_id)
        formData.append('type', type)

        return request.post<IContractDocument>('/project/contract/file/upload', formData)
    }

    removeFile = (contract_id: number, file_id: string) => request.delete('/project/contract/file/remove', {
        contract_id, file_id
    })
}

export default new ContractApi();