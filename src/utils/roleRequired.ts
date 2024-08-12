import {IUserRole} from "../types/role";

export const roleRequired = (currentUserId: number, roleSlugList: string[], userList: IUserRole[], allRoles?: boolean): boolean => {
    const newUserList = userList.filter(user => roleSlugList.includes(user.role.slug) && user.id === currentUserId)

    if (allRoles) {
        return newUserList.length === roleSlugList.length
    }

    return newUserList.length >= 1
}