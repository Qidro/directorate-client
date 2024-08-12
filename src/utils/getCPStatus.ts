import {CPStatus} from "../constants/calendarPlan";


export const getCPStatus = (status: string) => {
    if (status in CPStatus) {
        return [CPStatus[status].text, CPStatus[status].color]
    }

    return ['Неизвестный статус', '9B9B9B']
}