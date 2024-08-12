import {indicatorApprovalDoc} from "../constants/indicator";

export const getApprovalDoc = (doc: string) => {
    if (doc in indicatorApprovalDoc) {
        return indicatorApprovalDoc[doc].text
    }

    return 'Неизвестный документ'
}