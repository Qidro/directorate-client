import {makeAutoObservable, runInAction} from 'mobx'
import {IUser} from "../types/user";
import UserApi from "../api/user-api";

export class User {
    constructor() {
        makeAutoObservable(this)
    }

    isAuth: boolean = false
    user: IUser = {} as IUser


    /*
     * Actions
     */

    login = async (login: string, password: string) => {
        const res = await UserApi.login(login, password)

        runInAction(() => {
            this.user = res.data;
            this.isAuth = true;
        })

        return res
    }

    check = async () => {
        const res = await UserApi.check()

        runInAction(() => {
            this.user = res.data;
            this.isAuth = true;
        })

        return res
    }

    logout = async () => {
        const res = await UserApi.logout()

        runInAction(() => {
            this.user = {} as IUser;
            this.isAuth = false;
        })

        return res
    }

    checkRight = (slug: string) => {
        return this.user.rights.filter(right => right.slug === slug).length >= 1
    }
}