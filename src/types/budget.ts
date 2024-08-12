export interface IBudget {
    id: number,
    stage: {
        id: number,
        name: string,
        type: string,
    },
    funding_source: string,
    costs_name: string,
    spending_costs: number
}