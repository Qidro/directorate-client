import {indicatorEvaluationType} from "../constants/indicator";

export const getEvaluationType = (type: string) => {
    if (type in indicatorEvaluationType) {
        return indicatorEvaluationType[type].text
    }

    return 'Неизвестный тип'
}