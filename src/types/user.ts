import {IRight} from './right';

export interface IUser {
    id: number,
    login: string,
    firstname: string,
    lastname: string,
    surname: string,
    fullname: string,
    email: string,
    phone: string,
    avatar: string | null,
    position: {
        id: number,
        name: string,
        department: {
            id: number,
            name: string
        }
    },
    rights: IRight[],
}

export interface User {
    key: string;
    fullname: string;
    email: string;
    positionName: string;
    departmentName: string;
}

export interface IRegistration {
    login: string,
    firstname: string,
    lastname: string,
    surname: string,
    password: string,
    phone: string,
    email: string,
    positionId: number[]
}