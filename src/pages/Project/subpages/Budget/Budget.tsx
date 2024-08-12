import {observer} from "mobx-react-lite";
import {Button, Card, message, Typography} from "antd";
import ResizableAntdTable from "resizable-antd-table";
import {useStore} from "../../../../store";
import {useEffect, useState} from "react";
import {getColumns, ITableDataType} from "./tableData";
import BudgetApi from "../../../../api/budget-api";
import {IBudget} from "../../../../types/budget";
import {useParams} from "react-router-dom";
import BudgetModal from "../../../../components/BudgetModal/BudgetModal";
import {IBudgetForm} from "../../../../types/forms";
import {roleRequired} from "../../../../utils/roleRequired";
import {checkStore} from "../../../../utils/checkStore";
import CardTitle from "../../../../components/CardTitle/CardTitle";

const {Title} = Typography;

const budgetToTable = (budget: IBudget) => {
    return {
        key: budget.id,
        stage: {
            id: budget.stage.id,
            name: budget.stage.name
        },
        funding_source: budget.funding_source,
        costs_name: budget.costs_name,
        spending_costs: budget.spending_costs,
    }
}

const Budget = () => {
    const {projectId} = useParams()

    const [budgetModalOpen, setBudgetModalOpen] = useState<boolean>(false);
    const [budgetModalLoading, setBudgetModalLoading] = useState<boolean>(false);
    const [budgetLoading, setBudgetLoading] = useState<boolean>(false);
    const [tableData, setTableData] = useState<ITableDataType[]>([]);
    const [initialValuesModal, setInitialValuesModal] = useState<IBudget>()

    const {
        project: projectStore,
        user: userStore,
    } = useStore();

    const editClickHandler = async (budget_id: number) => {
        message.loading('Загрузка данных строки расхода');
        try {
            const res = await BudgetApi.getBudget(budget_id);
            setInitialValuesModal(res.data);
            message.destroy();
            setBudgetModalOpen(true);
        } catch (e) {
            message.destroy()
            message.error('Ошибка заргузки данных');
        }
    };

    const createBudget = async (budget: IBudgetForm) => {
        setBudgetModalLoading(true);
        try {
            const res = await BudgetApi.create(projectStore.project.id, budget.stage_id,
                budget.funding_source, budget.costs_name, budget.spending_costs);
            setTableData([...tableData, budgetToTable(res.data)]);
            message.success('Строка расходов добавлена');
            setBudgetModalOpen(false);
        } catch (e) {
            message.error('Ошибка добавления строки расходов');
        }
        setBudgetModalLoading(false);
    };

    const editBudget = async (budget: IBudgetForm) => {
        setBudgetModalLoading(true);
        try {
            const res = await BudgetApi.edit(initialValuesModal!.id,
                budget.funding_source, budget.costs_name, budget.spending_costs);
            setTableData(tableData.map(item => (
                item.key === initialValuesModal!.id
                ?
                    budgetToTable(res.data)
                :
                    item
            )))
            message.success('Строка расходов изменена');
            setBudgetModalOpen(false);
        } catch (e) {
            message.error('Ошибка изменения строки расходов');
        }
        setBudgetModalLoading(false);
    };

    const removeBudget = async (budget_id: number) => {
        message.loading('Удаление строки расхода');
        try {
            message.destroy();
            await BudgetApi.delete(budget_id);
            setTableData(tableData?.filter(item => item.key !== budget_id));
        } catch (e) {
            message.error('Строка расхода удалена');
        }
    };

    const closeModalHandler = () => {
        setBudgetModalOpen(false)
        setInitialValuesModal(undefined)
    }

    useEffect(() => {
        const fetchBudgets = async () => {
            setBudgetLoading(true);
            try {
                const res = await BudgetApi.getBudgets(projectId!);
                setTableData(res.data.map(budget => budgetToTable(budget)));
            } catch (e) {
                message.error('Ошибка загрузки бюджета');
            }
            setBudgetLoading(false);
        };

        fetchBudgets().then();
    }, [projectStore, projectId])

    return (
        <Card>
            <CardTitle block>
                <Title level={4}>Бюджет проекта</Title>
                {
                    checkStore([projectStore.project, userStore.user]) &&
                    projectStore.editable &&
                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) &&
                    <Button type='primary' onClick={() => setBudgetModalOpen(true)}>Добавить строку расхода</Button>
                }
            </CardTitle>

            <ResizableAntdTable
                columns={getColumns(editClickHandler, removeBudget, projectStore.editable, projectStore.project.id,
                    checkStore([projectStore.project, userStore.user]) &&
                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users))}
                bordered
                dataSource={tableData}
                loading={budgetLoading}
                scroll={{x: 800}}
                pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
                rowClassName='tableRow'
            />

            <BudgetModal
                open={budgetModalOpen}
                onClose={closeModalHandler}
                onSubmit={initialValuesModal ? editBudget : createBudget}
                loading={budgetModalLoading}
                initialValues={initialValuesModal ? {
                    stage_id: initialValuesModal.stage.id,
                    funding_source: initialValuesModal.funding_source,
                    costs_name: initialValuesModal.costs_name,
                    spending_costs: initialValuesModal.spending_costs,
                } : undefined}
                titleText={initialValuesModal ? 'Редактирование строки расходов' : 'Новая строка расходов'}
                submitText={initialValuesModal ? 'Сохранить' : 'Добавить'}
            />
        </Card>
    );
};

export default observer(Budget);