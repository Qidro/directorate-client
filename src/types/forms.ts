export interface IAuthForm {
    login: string,
    password: string
}

export interface IUserEditForm {
    lastname: string,
    firstname: string,
    surname: string,
    positionId: number[],
    login: string,
    email: string,
}

export interface IProposalForm {
    name: string,
    realization_period?: any[],
    executors: string,
    justification: string,
    purpose: string,
    results: string,
    target_indicators: string,
    planned_actions: string,
    resources: string,
    contacts: string,
}

export interface IProposalCommentForm {
    name: string,
    realization_period?: any,
    executors: string,
    justification: string,
    purpose: string,
    results: string,
    target_indicators: string,
    planned_actions: string,
    resources: string,
    contacts: string,
}

export interface IBackpackForm {
    name: string,
    description: string
}

export interface IConvertToProjectForm {
    backpackId: string | number,
    userId: string | number
    userCuratorId: string | number
}

export interface IProjectForm {
    name: string,
    short_name: string,
    priority: string,
    type: string,
    description: string,
    formal_basis: string,
    project_justification: string,
    additional_info: string,
    project_goals: string
    risks: string
    deviations: string
}

export interface IIndicatorForm {
    name: string,
    evaluation_type: string,
    evaluation_frequency: string,
    units_measure: string,
    base_value: string,
    base_value_date: string,
    description: string,
    info_collection: string,
    coverage_units: string,
    approval_doc: string,
}

export interface IResultForm {
    name: string,
    type: string,
    unitsMeasure: string,
    characteristic: string,
    approvalDoc: string
}

export interface IIndicatorValueForm {
    period: any,
    plan_value: number,
    forecast_value: number,
    actual_value: number
}

export interface IAlertForm {
    text: string
}

export interface IResultValueForm {
    achievementDate: any,
    planValue: number,
    forecastValue: number
}

export interface IContractForm {
    name: string,
    type: string,
    federalLaw: string,
    plannedCost: number,
    cost?: number,
    paid?: number,
    description?: string,
    link?: string
}

export interface ICalendarPlanForm {
    type: string,
    name: string,
    awaiting_result: string,
    start_date_plan: any,
    start_date_forecast?: any,
    start_date_fact?: any,
    end_date_plan: any,
    end_date_forecast?: any,
    end_date_fact?: any,
    end_date?: any
    approval_doc: string,
    parent_stage_id?: number
}

export interface IBudgetForm {
    stage_id: number,
    costs_name: string,
    funding_source: string,
    spending_costs: number,
}