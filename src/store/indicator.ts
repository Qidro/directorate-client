import {makeAutoObservable} from "mobx";
import {IProjectIndicator} from "../types/indicator";
import IndicatorApi from "../api/indicator-api";
import dayjs from "dayjs";
import {IIndicatorForm} from "../types/forms";
import {IRole} from "../types/role";

export class Indicator {
    constructor() {
        makeAutoObservable(this)
    }

    indicator: IProjectIndicator = {} as IProjectIndicator
    setProjectIndicatorInformation = (data: IProjectIndicator) => this.indicator = data

    roles: IRole[] = []
    setRoles = (roles: IRole[]) => this.roles = roles

    getIndicator = async (indicatorId: string) => {
        this.setProjectIndicatorInformation({} as IProjectIndicator);

        const res = await IndicatorApi.getIndicator(indicatorId);

        res.data.base_value_date = dayjs(res.data.base_value_date).isValid()
            ? dayjs(res.data.base_value_date)
            : undefined;

        this.setProjectIndicatorInformation(res.data);
        return res;
    }

    updateIndicator = async (data: IIndicatorForm) => {
        const res = await IndicatorApi.update(
            this.indicator.id,
            data.name,
            data.evaluation_type,
            data.evaluation_frequency,
            data.units_measure ? data.units_measure : '',
            data.base_value,
            data.base_value_date ? data.base_value_date : '0000-00-00',
            data.description,
            data.info_collection ? data.info_collection : '',
            data.coverage_units ? data.coverage_units : '',
            data.approval_doc
        );

        this.setProjectIndicatorInformation({...res.data,
            base_value_date: dayjs(res.data.base_value_date)});

        return res
    }

    getRoles = async () => {
        const res = await IndicatorApi.getIndicatorRoles();
        this.setRoles(res.data);

        return res
    }

    addUserRole = async (userId: number, roleId: number) => {
        const res = await IndicatorApi.addUserRole(userId, roleId, this.indicator.id);

        this.setProjectIndicatorInformation({
            ...this.indicator,
            users: [...this.indicator.users, res.data]
        });

        return res
    }

    removeUserRole = async (userId: number, roleId: number) => {
        const res = await IndicatorApi.removeUserRole(userId, roleId, this.indicator.id);

        this.setProjectIndicatorInformation({
            ...this.indicator,
            users: this.indicator.users.filter(user => user.id !== userId || user.role.id !== roleId)
        });

        return res
    }

    addValue = async (period: string, plan_value: number, forecast_value: number | string, actual_value: number) => {
        const res = await IndicatorApi.addIndicatorValue(this.indicator.id, period, plan_value,
            forecast_value ? forecast_value : '',
            actual_value ? actual_value : '')

        this.setProjectIndicatorInformation({
            ...this.indicator,
            indicator_values: [...this.indicator.indicator_values!, res.data]
        })

        return res
    }

    updateValue = async (valueId: number, period: string, plan_value: number, forecast_value: number | string, actual_value: number) => {
        const res = await IndicatorApi.updateIndicatorValue(valueId, period, plan_value,
            forecast_value ? forecast_value : '',
            actual_value ? actual_value : '')

        this.setProjectIndicatorInformation({
            ...this.indicator,
            indicator_values: [...this.indicator.indicator_values!.filter(value => value.id !== valueId),
                res.data]
        })

        return res
    }

    removeValue = async (indicator_value_id: number) => {
        const res = await IndicatorApi.deleteIndicatorValue(indicator_value_id);

        this.setProjectIndicatorInformation({
            ...this.indicator,
            indicator_values: this.indicator.indicator_values?.filter(value =>
                value.id !== indicator_value_id)
        })

        return res
    }
}