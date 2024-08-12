import {calendarPlanType} from "../constants/calendarPlan";

export const getCalendarPlanType = (type: string) => {
    if (type in calendarPlanType) {
        return calendarPlanType[type].text
    }

    return 'Неизвестный тип'
}