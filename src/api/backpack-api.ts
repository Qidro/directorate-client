import request from "./index";
import {
    IBackpack,
    IBackpackProjectBudget,
    IBackpackProjectCalendarPlan,
    IBackpackProjectIndicator
} from "../types/backpack";
import {IRole, IUserRole} from "../types/role";

class BackpackApi {
    getMyBackpacks = () => request.get<IBackpack[]>('/backpacks')
    getAllBackpacks = () => request.get<IBackpack[]>('/backpacks/all')

    getById = (backpackId: string | number) => request.get<IBackpack>('/backpack/'+backpackId)

    create = (name: string, description: string) => request.post<IBackpack>('/backpack/create',
        {name, description}
    )

    update = (backpack_id: number, name: string, description: string) => request.post<IBackpack>('/backpack/update',
        {backpack_id, name, description}
    )

    delete =(backpack_id: number) => request.delete('/backpack/delete', {backpack_id})

    getRoles = () => request.get<IRole[]>('/backpack/roles')

    addUserRole = (user_id: number, role_id: number, backpack_id: number) => request.post<IUserRole>('/backpack/user/role/set',
        {user_id, role_id, backpack_id}
    )

    removeUserRole = (user_id: number, role_id: number, backpack_id: number) => request.delete('/backpack/user/role/remove',
        {user_id, role_id, backpack_id}
    )

    getIndicators = (backpackId: string | number) => request.get<IBackpackProjectIndicator[]>('/backpack/'+backpackId+'/indicators')

    getCalendarPlans = (backpackId: string | number) => request.get<IBackpackProjectCalendarPlan[]>('/backpack/'+backpackId+'/calendar_plans')

    getBudgets = (backpackId: string | number) => request.get<IBackpackProjectBudget[]>('/backpack/'+backpackId+'/budgets')
}

export default new BackpackApi()