import {makeAutoObservable} from "mobx";
import {IRole} from "../types/role";
import {IProjectContractFull} from "../types/contract";
import ContractApi from "../api/contract-api";
import {IContractForm} from "../types/forms";

export class Contract {
    constructor() {
        makeAutoObservable(this)
    }

    contract: IProjectContractFull = {} as IProjectContractFull
    setProjectContractInformation = (data: IProjectContractFull) => this.contract = data

    roles: IRole[] = []
    setRoles = (roles: IRole[]) => this.roles = roles

    getContract = async (contractId: string) => {
        this.setProjectContractInformation({} as IProjectContractFull);

        const res = await ContractApi.getContract(contractId);

        this.setProjectContractInformation(res.data);

        return res
    }

    getRoles = async () => {
        const res = await ContractApi.getRoles();

        this.setRoles(res.data);

        return res
    }

    addUserRole = async (userId: number, roleId: number) => {
        const res = await ContractApi.addUserRole(userId, roleId, this.contract.id)

        this.setProjectContractInformation({
            ...this.contract,
            users: [...this.contract.users, res.data]
        });

        return res
    }

    removeUserRole = async (userId: number, roleId: number) => {
        const res = await ContractApi.removeUserRole(userId, roleId, this.contract.id)

        this.setProjectContractInformation({
            ...this.contract,
            users: this.contract.users.filter(user => user.id !== userId || user.role.id !== roleId)
        });

        return res
    }

    update = async (data: IContractForm) => {
        const res = await ContractApi.update(
            this.contract.id,
            data.name,
            data.type,
            data.federalLaw,
            data.plannedCost,
            data.cost,
            data.paid,
            data.description,
            data.link
        );

        this.setProjectContractInformation(res.data);

        return res
    }

    uploadDocument = async (file: File, type: string) => {
        const res = await ContractApi.uploadFile(this.contract.id.toString(), file, type)

        this.setProjectContractInformation({
            ...this.contract,
            documents: [...this.contract.documents, res.data]
        })

        return res
    }

    removeDocument = async (file_id: string) => {
        await ContractApi.removeFile(this.contract.id, file_id)

        this.setProjectContractInformation({
            ...this.contract,
            documents: this.contract.documents.filter(item => item.file_id !== file_id)
        })
    }

    checkDocument = async (type: string) => {
        return !!this.contract.documents.find(document => document.type === type)
    }

    getDocumentTypeByStage = async (stage: string) => {
        let type = '';
        if (stage === 'COMPETITIVE_PROCEDURES') type = 'TRADING'
        if (stage === 'SIGNING') type = 'AUCTION'
        if (stage === 'EXECUTED') type = 'CONTRACT_DOCUMENTS'

        return type
    }
}