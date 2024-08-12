export interface IResourceWorking {
    key: number
    fullname: string,
    position: string,
    roles: {
        name: string,
        description: string
    }[]
}

export interface IResourceCP {
    key: number,
    fullname: string,
    role_name: string,
    task: string,
    dates: string
}