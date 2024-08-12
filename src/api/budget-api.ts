import request from "./index";
import {IBudget} from "../types/budget";

class BudgetApi {
    create = (project_id: number, stage_id: number, funding_source: string, costs_name: string, spending_costs: number) =>
        request.post<IBudget>('/budget/create', {
            project_id, stage_id, funding_source, costs_name, spending_costs
        })

    edit = (budget_id: number, funding_source: string, costs_name: string, spending_costs: number) =>
        request.post<IBudget>('/budget/edit', {
            budget_id, funding_source, costs_name, spending_costs
        })

    delete = (budget_id: number) => request.delete('/budget/delete', {
        budget_id
    })

    getBudgets = (project_id: number | string) => request.get<IBudget[]>('/project/' + project_id + '/budgets')

    getBudget = (budget_id: number) => request.get<IBudget>('/budget/' + budget_id)
}

export default new BudgetApi();