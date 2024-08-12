import {indicatorStatus} from "../constants/indicator";

export const getIndicatorStatus = (status: string) => {
    if (status in indicatorStatus) {
        return [indicatorStatus[status].text, indicatorStatus[status].color]
    }

    return ['Неизвестный статус', '9B9B9B']
}