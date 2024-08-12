import {expertsStatus} from "../constants/proposal";

export const getExpertStatus = (status: string) => {
    if (status in expertsStatus) {
        return [expertsStatus[status].text, expertsStatus[status].color]
    }

    return ['Не оценено', '9B9B9B']
}