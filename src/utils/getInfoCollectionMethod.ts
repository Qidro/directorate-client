import {indicatorInfoCollectionMethod} from "../constants/indicator";

export const getInfoCollectionMethod = (method: string) => {
    if (method in indicatorInfoCollectionMethod) {
        return indicatorInfoCollectionMethod[method].text
    }

    return ''
}