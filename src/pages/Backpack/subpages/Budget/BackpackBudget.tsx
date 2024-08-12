import {Card, message, Table, Typography} from "antd";
import {useEffect, useState} from "react";
import {getColumns, getExpandedTable} from "./tableData";
import {useParams} from "react-router-dom";
import {IBackpackProjectBudget} from "../../../../types/backpack";
import BackpackApi from "../../../../api/backpack-api";

const {Title} = Typography;

const BackpackBudget = () => {
    const {backpackId} = useParams();

    const [tableData, setTableData] = useState<IBackpackProjectBudget[]>();
    const [budgetLoading, setBudgetLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchIndicators = async () => {
            setBudgetLoading(true);

            try {
                const res = await BackpackApi.getBudgets(backpackId!);
                setTableData(res.data);
            } catch (e) {
                message.error('Ошибка загрузки бюджета!');
            }

            setBudgetLoading(false);
        }

        fetchIndicators().then();
    }, [backpackId])

    return (
        <Card>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
                <Title level={4}>Бюджет</Title>
            </div>
            <Table
                bordered
                scroll={{x: 'max-content'}}
                columns={getColumns()}
                expandable={{ expandedRowRender: (record) => getExpandedTable(record), defaultExpandedRowKeys: ['0'] }}
                dataSource={tableData}
                loading={budgetLoading}
                rowKey='id'
            />
        </Card>
    );
};

export default BackpackBudget;