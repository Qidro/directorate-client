import {makeAutoObservable} from "mobx";
import {IBackpack} from "../types/backpack";
import {IRole} from "../types/role";
import BackpackApi from "../api/backpack-api";
import {IBackpackForm} from "../types/forms";

export class Backpack {
    constructor() {
        makeAutoObservable(this)
    }

    backpack: IBackpack = {} as IBackpack;
    setBackpackInformation = (data: IBackpack) => this.backpack = data;

    roles: IRole[] = [];
    setRoles = (roles: IRole[]) => this.roles = roles;

    getBackpack = async (backpackId: string | number) => {
        const res = await BackpackApi.getById(backpackId);

        this.setBackpackInformation(res.data);

        return res;
    }

    getRoles = async () => {
        const res = await BackpackApi.getRoles();

        this.setRoles(res.data);

        return res;
    }

    update = async (data: IBackpackForm) => {
        const res = await BackpackApi.update(this.backpack.id, data.name, data.description);

        this.setBackpackInformation(res.data);

        return res;
    }

    addUserRole = async (userId: number, roleId: number) => {
        const res = await BackpackApi.addUserRole(userId, roleId, this.backpack.id);

        this.setBackpackInformation({
            ...this.backpack,
            users: [...this.backpack.users, res.data]
        });

        return res;
    }

    removeUserRole = async (userId: number, roleId: number) => {
        const res = await BackpackApi.removeUserRole(userId, roleId, this.backpack.id);

        this.setBackpackInformation({
            ...this.backpack,
            users: this.backpack.users.filter(user => user.id !== userId || user.role.id !== roleId)
        });

        return res;
    }
}