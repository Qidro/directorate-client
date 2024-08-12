import {makeAutoObservable} from 'mobx'
import {IProposalWithFullExperts} from "../types/proposal";
import ProposalApi from "../api/proposal-api";
import {IProposalCommentForm, IProposalForm} from "../types/forms";

export class Proposal {
    constructor() {
        makeAutoObservable(this)
    }

    proposal: IProposalWithFullExperts = {} as IProposalWithFullExperts
    setProposalInformation = (data: IProposalWithFullExperts) => this.proposal = data

    editOpen: boolean = false
    setEditOpen = (state: boolean) => this.editOpen = state

    getProposal = async (proposalId: string | number) => {
        this.setProposalInformation({} as IProposalWithFullExperts)

        const res = await ProposalApi.getProposal(proposalId);

        this.setProposalInformation(res.data)
        return res
    }

    getExperts = () => {
        return this.proposal.experts || []
    }

    getComments = () => {
        return this.proposal.comments || []
    }

    getUserComment = (userId: number) => {
        return this.proposal.comments?.find(comment => comment.user.id === userId)
    }

    updateProposal = async (data: IProposalForm) => {
        const res = await ProposalApi.updateProposal(
            this.proposal.id,
            data.name,
            data.realization_period ? data.realization_period[0].format('YYYY-MM-DD') : '',
            data.realization_period ? data.realization_period[1].format('YYYY-MM-DD') : '',
            data.executors,
            data.justification,
            data.purpose,
            data.results,
            data.target_indicators,
            data.planned_actions,
            data.resources,
            data.contacts
        )

        this.setProposalInformation({
            ...res.data,
            experts: this.proposal.experts,
            comments: this.proposal.comments,
            verdict: this.proposal.verdict
        })

        return res
    }

    removeExpert = async (userId: number) => {
        await ProposalApi.removeExpert(userId, this.proposal.id)
        this.setProposalInformation({
            ...this.proposal,
            experts: this.getExperts().filter(expert => expert.user.id !== userId)
        })
    }

    addExpert = async (userId: number) => {
        const res = await ProposalApi.setExpert(userId, this.proposal.id)

        this.setProposalInformation({
            ...this.proposal,
            experts: [...this.proposal.experts, res.data]
        })

        return res
    }

    sendComment = async (data: IProposalCommentForm, status: string, currentUserId: number) => {
        const res = await ProposalApi.addComment(
            this.proposal.id,
            status,
            data.name,
            data.realization_period,
            data.executors,
            data.justification,
            data.purpose,
            data.results,
            data.target_indicators,
            data.planned_actions,
            data.resources,
            data.contacts
        )

        if (this.proposal.comments.filter(item => item.user.id === res.data.user.id).length > 0) {
            this.setProposalInformation({
                ...this.proposal,
                comments: [...this.proposal.comments.filter(item => item.user.id !== res.data.user.id), res.data]
            })
        } else {
            this.setProposalInformation({
                ...this.proposal,
                comments: [...this.proposal.comments, res.data]
            })
        }

        this.setProposalInformation({
            ...this.proposal,
            experts: [...this.proposal.experts.map(expert => {
                if (expert.user.id === currentUserId) {
                    return {...expert, verification_status: status}
                }
                
                return expert
            })]
        })

        return res
    }
}