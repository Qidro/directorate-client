export interface IProposal {
    id: number,
    user: {
        fullname: string,
        id: number
    },
    status: 'SUCCESS' | 'REJECT' | 'REVIEW' | 'EXPERTS_EVALUATE' | 'DIRECTOR_EVALUATE' | 'ARCHIVED',
    submission_date: string,
    contacts: string,
    planned_actions: string,
    resources: string,
    executors: string,
    experts_count: number,
    experts_success_count: number,
    realization_period: string[],
    isArchived: false,
    justification: string,
    name: string,
    purpose: string,
    results: string,
    target_indicators: string,
    experts: ISmallExpert[],
}

export interface IProposalWithFullExperts extends Omit<IProposal, 'experts'> {
    experts: ProposalExpert[],
    comments: ProposalComments[],
    verdict: IFinalVerdict
}

export interface ProposalComments {
    id: number,
    user: {
        fullname: string,
        id: number
    },
    date: string
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
}

export interface ProposalExpert {
    user: {
        fullname: string,
        id: number
    },
    verification_status: string,
    date_verification: string,
    date_appointment: string
}

export interface ISmallExpert {
    id: number,
    fullname: string,
    verification_status: string
}

export interface IFinalVerdict {
    user: {
        id: number,
        fullname: string
    },
    conclusion: string,
    status: string,
    date: string
}