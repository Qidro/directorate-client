import request from "./index";
import {IUser} from "../types/user";
import {IRight} from "../types/right";

class UserApi {
    login = (login: string, password: string) => {
        return request.post<IUser>('/user/login', {
            login,
            password
        })
    }

    check = () => request.get<IUser>('/user/checkout')

    logout = () => request.post('/user/logout')

    getRights = () => request.get<IRight[]>('/user/rights')

    getUsers = () => request.get<IUser[]>('/users')

    getArchivedUsers = () => request.get<IUser[]>('/archive/users')

    registration = (login: string, firstname: string, lastname: string, surname: string,
                    password: string, phone: string, email: string, position_id: number) => {
        return request.post<IUser>('/user/registration', {
            login, firstname, lastname, surname, password, phone, email, position_id
        });
    }

    NewRegistration = (login: string, firstname: string, lastname: string, surname: string,
        password: string, phone: string, email: string, position_id: number) => {
    return request.post<IUser>('/user/NewRegistration', {
    login, firstname, lastname, surname, password, phone, email, position_id
    });
    }

    edit = (user_id: number, login: string, firstname: string, lastname: string, surname: string, email: string, position_id: number) => {
        return request.post<IUser>('/user/edit', {
            user_id, login, firstname, lastname, surname, email, position_id
        })
    }

    restore = (user_id: number) => {
        return request.post<IUser>('/archive/user/unzip', {
            user_id
        })
    }

    changePassword = (user_id: number, password: string) => request.post('/user/change_password', {
        user_id, password
    })

    delete = (user_id: string) => {
        return request.delete('/user/delete', {
            user_id
        });
    };

    getUser = (userId: string) => request.get<IUser>('/user/'+userId)

    setRight = (user_id: number, right_id: number) => {
        return request.post<IRight>('/user/rights/add', {
            user_id, right_id
        });
    };

    removeRight = (user_id: number, right_id: number) => {
        return request.delete('/user/rights/remove', {
            user_id, right_id
        });
    };
}

export default new UserApi();