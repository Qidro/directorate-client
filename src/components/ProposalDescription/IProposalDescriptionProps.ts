import {IProposal, IProposalWithFullExperts, ProposalComments} from "../../types/proposal";

export interface IProposalDescriptionProps {
    proposal?: IProposal | IProposalWithFullExperts | ProposalComments
}