import {resultStatus} from "../constants/result";

export const getResultStatus = (status: string) => {
    if (status in resultStatus) {
        return [resultStatus[status].text, resultStatus[status].color]
    }

    return ['Неизвестный статус', '9B9B9B']
}