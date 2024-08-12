import {indicatorEvaluationFrequency} from "../constants/indicator";

export const getEvaluationFrequency = (frequency: string) => {
    if (frequency in indicatorEvaluationFrequency) {
        return indicatorEvaluationFrequency[frequency].text
    }

    return 'Неизвестная частота оценки'
}