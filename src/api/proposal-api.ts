import request from "./index";
import {IFinalVerdict, IProposal, IProposalWithFullExperts, ProposalComments, ProposalExpert} from "../types/proposal";
import {IUser} from "../types/user";
import {IProjectFull} from "../types/project";

class ProposalApi {
    getMyProposals = () => request.get<IProposal[]>('/proposals');

    getAllProposals = () => request.get<IProposal[]>('/proposals/all');

    getExpertProposals = () => request.get<IProposal[]>('/proposals/expert');

    getArchivedProposals = () => request.get<IProposal[]>('/archive/proposals')

    restoreProposal = (proposal_id: number) => request.post<IProposal>('/archive/proposal/unzip', {
        proposal_id
    })

    createProposal = (
        name: string,
        realization_period_start: string,
        realization_period_end: string,
        executors: string,
        justification: string,
        purpose: string,
        results: string,
        target_indicators: string,
        planned_actions: string,
        resources: string,
        contacts: string
    ) => request.post<IProposal>('/proposal/create', {
        name, realization_period_start, realization_period_end, executors, justification, purpose, results, target_indicators, planned_actions, resources, contacts,
    });

    getProposal = (proposalId: string | number) => request.get<IProposalWithFullExperts>('/proposal/'+proposalId);

    updateProposal = (
        id: number,
        name: string,
        realization_period_start: string,
        realization_period_end: string,
        executors: string,
        justification: string,
        purpose: string,
        results: string,
        target_indicators: string,
        planned_actions: string,
        resources: string,
        contacts: string
    ) => request.post<IProposal>('proposal/update', {
        id, name, realization_period_start, realization_period_end, executors, justification, purpose, results, target_indicators, planned_actions, resources, contacts
    });

    removeExpert = (user_id: number, proposal_id: number) => request.delete('/proposal/expert/remove', {
        proposal_id, user_id
    });

    setExpert = (user_id: number, proposal_id: number) => request.post<ProposalExpert>('/proposal/expert/set', {
        user_id, proposal_id
    });

    getExperts = (proposalId?: number) => request.get<IUser[]>(`/proposal/${proposalId}/experts`)

    addComment = (
        proposal: number,
        status: string,
        name: string,
        realization_period: string,
        executors: string,
        justification: string,
        purpose: string,
        results: string,
        target_indicators: string,
        planned_actions: string,
        resources: string,
        contacts: string
    ) => request.post<ProposalComments>('/proposal/add_comment', {
        proposal, status, name, realization_period, executors, justification, purpose, results,
        target_indicators, planned_actions, resources, contacts
    });

    setVerdict = (proposal_id: string | number, conclusion: string, status: 'SUCCESS' | 'REJECT' | 'ARCHIVED') => request.post<IFinalVerdict>('/proposal/verdict/set', {
        proposal_id, conclusion, status
    });

    download = (proposal_id: string | number) => request.getBlob<Blob>(`/generation/proposal/${proposal_id}`);

    downloadWComments = (proposal_id: string | number) => request.getBlob<Blob>(`/generation/proposal_w_comments/${proposal_id}`);

    convertToProject = (proposal_id: string | number,
                        backpack_id: string | number,
                        user_id: string | number,
                        user_curator_id: string | number
    ) => request.post<IProjectFull>('/project/create', {
        proposal_id, backpack_id, user_id, user_curator_id
    });
}

export default new ProposalApi();