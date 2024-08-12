import {makeAutoObservable} from "mobx";
import {IResult, IResultValue, ResultStatus} from "../types/result";
import {IRole} from "../types/role";
import ResultApi from "../api/result-api";
import {IResultForm, IResultValueForm} from "../types/forms";

export class Result {
    constructor() {
        makeAutoObservable(this)
    }

    result: IResult = {} as IResult
    setResult = (result: IResult) => this.result = result

    roles: IRole[] = []
    setRoles = (roles: IRole[]) => this.roles = roles

    values: IResultValue[] = []
    setValues = (values: IResultValue[]) => this.values = values

    valuesLoading: boolean = false
    setValuesLoading = (state: boolean) => this.valuesLoading = state

    fetchResult = async (id: number | string) => {
        this.setResult({} as IResult)
        const res = await ResultApi.getById(id)
        this.setResult(res.data)

        return res
    }

    updateResult = async (data: IResultForm) => {
        const res = await ResultApi.update(
            this.result.id,
            data.name,
            data.type,
            data.unitsMeasure,
            data.characteristic,
            data.approvalDoc,
            this.result.status
        )

        this.setResult(res.data);
        return res
    }

    updateStatus = async (status: ResultStatus) => {
        const res = await ResultApi.update(
            this.result.id,
            this.result.name,
            this.result.type,
            this.result.units_measure,
            this.result.characteristic,
            this.result.approval_doc,
            status
        )

        this.setResult(res.data);
        return res
    }

    fetchRoles = async () => {
        const res = await ResultApi.getRoles()
        this.setRoles(res.data)

        return res
    }

    addUserRole = async (userId: number, roleId: number) => {
        const res = await ResultApi.addUserRole(userId, roleId, this.result.id);

        this.setResult({
            ...this.result,
            users: [...this.result.users, res.data]
        });

        return res
    }

    removeUserRole = async (userId: number, roleId: number) => {
        const res = await ResultApi.removeUserRole(userId, roleId, this.result.id);

        this.setResult({
            ...this.result,
            users: this.result.users.filter(user => user.id !== userId || user.role.id !== roleId)
        });

        return res
    }

    fetchValues = async (resultId: number | string) => {
        this.setValuesLoading(true)
        const res = await ResultApi.getValues(resultId)
        this.setValues(res.data)
        this.setValuesLoading(false)

        return res
    }

    createValue = async (data: IResultValueForm) => {
        const res = await ResultApi.createValue(
            this.result.id,
            data.achievementDate.format('YYYY-MM-DD'),
            data.planValue,
            data.forecastValue
        )

        this.setValues([...this.values, res.data])

        return res
    }

    updateValue = async (valueId: number, data: IResultValueForm) => {
        const res = await ResultApi.updateValue(
            valueId,
            data.achievementDate.format('YYYY-MM-DD'),
            data.planValue,
            data.forecastValue
        )

        this.setValues(this.values.map(item => {
            if (item.id === res.data.id) return res.data
            return item
        }))

        return res
    }

    removeValue = async (id: number) => {
        this.setValuesLoading(true)
        await ResultApi.removeValue(id)
        this.setValuesLoading(false)
        this.setValues(this.values.filter(item => item.id !== id))
    }
}