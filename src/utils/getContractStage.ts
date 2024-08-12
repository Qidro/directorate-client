import {contractStage} from "../constants/contract";

export const getContractStage = (stage: string) => {
    if (stage in contractStage) {
        return [contractStage[stage].text, contractStage[stage].color]
    }

    return ['Неизвестная стадия', '9B9B9B']
}