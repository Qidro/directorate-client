import {IRole, IUserRole} from "../../types/role";

export interface IMembersModalProps {
    open: boolean,
    onClose?: () => void,
    onSelect?: (roleId: number, userId: number) => void,
    onDeselect?: (roleId: number, userId: number) => void,
    roles: IRole[],
    initialValues?: IUserRole[],
    loadingFields: number[]
}