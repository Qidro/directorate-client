import {ProposalExpert} from "../types/proposal";

export const checkExpert = (experts: ProposalExpert[], currentUserId: number): boolean => {
    return experts.filter(expert => expert.user.id === currentUserId).length >= 1
}