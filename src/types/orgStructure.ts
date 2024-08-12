export interface Department {
    id: number,
    name: string,
    positions: Position[]
}

export interface Position {
    id: number,
    name: string
}

export interface NewDepartment {
    name: string
}

export interface NewPosition {
    name: string,
    department_id: number
}