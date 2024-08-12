import {IUserRole} from "./role";

export interface IProjectContract {
    id: number,
    project: {
        id: string | number,
        name: string,
    },
    name: string,
    type: string,
    federal_law: string,
    planned_cost: number,
    cost: number,
    paid: number,
    description: string,
    link: string,
    status: 'INITIATION' | 'DOC_PREPARED' | 'COMPETITIVE_PROCEDURES' | 'SIGNING' | 'EXECUTED',
    users: IUserRole[]
}

export interface IProjectContractFull extends IProjectContract {
    documents: IContractDocument[]
}

export interface IContractDocument {
    file_id: string,
    filename: string,
    type: FileTypes,
}

export type FileTypes = 'OTHER' | 'TRADING' | 'AUCTION' | 'CONTRACT_DOCUMENTS'