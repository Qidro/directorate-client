import {proposalStatus} from "../constants/proposal";

export const getProposalStatus = (status: string) => {
    if (status in proposalStatus) {
        return [proposalStatus[status].text, proposalStatus[status].color]
    }

    return ['Неизвестный статус', '9B9B9B']
}