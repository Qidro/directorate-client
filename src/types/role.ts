export interface IRole {
    id: number,
    name: string,
    slug: string
}

export interface IUserRole {
    id: number,
    fullname: string,
    role: IRole
}