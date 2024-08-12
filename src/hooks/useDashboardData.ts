import {useEffect, useState} from "react";
import {IDashboardAdvanced, IDashboardCommon} from "../types/dashboard";
import DashboardApi from "../api/dashboard";

export const useDashboardData = (startDate: string, endDate: string) => {
    const [commonData, setCommonData] = useState<IDashboardCommon>()
    const [commonDataLoading, setCommonDataLoading] = useState<boolean>(true)

    const [advancedData, setAdvancedData] = useState<IDashboardAdvanced>()
    const [advancedDataLoading, setAdvancedDataLoading] = useState<boolean>(true)

    useEffect(() => {
        setCommonDataLoading(true)
        DashboardApi.getCommon(startDate, endDate).then(res => {
            setCommonData(res.data)
            setCommonDataLoading(false)
        })

        setAdvancedDataLoading(true)
        DashboardApi.getAdvanced(startDate, endDate).then(res => {
            setAdvancedData(res.data)
            setAdvancedDataLoading(false)
        })
    }, [endDate, startDate]);

    return {
        common: {
            data: commonData,
            loading: commonDataLoading
        },
        advanced: {
            data: advancedData,
            loading: advancedDataLoading
        }
    } as const
}