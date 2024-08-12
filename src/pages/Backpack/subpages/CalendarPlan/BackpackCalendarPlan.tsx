import {useEffect, useState} from 'react';
import {Card, message, Table, Typography} from "antd";
import {observer} from "mobx-react-lite";
import {useParams} from "react-router-dom";
import {IBackpackProjectCalendarPlan} from "../../../../types/backpack";
import BackpackApi from "../../../../api/backpack-api";
import {getExpandedTable, getColumns} from "./tableData";

const {Title} = Typography;

const BackpackCalendarPlan = () => {
    const {backpackId} = useParams();

    const [tableData, setTableData] = useState<IBackpackProjectCalendarPlan[]>();
    const [calendarPlanLoading, setCalendarPlanLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchIndicators = async () => {
            setCalendarPlanLoading(true);

            try {
                const res = await BackpackApi.getCalendarPlans(backpackId!);
                setTableData(res.data);
            } catch (e) {
                message.error('Ошибка загрузки календраного плана!');
            }

            setCalendarPlanLoading(false);
        }

        fetchIndicators().then();
    }, [backpackId])

    return (
        <Card>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
                <Title level={4}>Календарный план</Title>
            </div>
            <Table
                bordered
                scroll={{x: 'max-content'}}
                columns={getColumns()}
                expandable={{ expandedRowRender: (record) => getExpandedTable(record), defaultExpandedRowKeys: ['0'] }}
                dataSource={tableData}
                loading={calendarPlanLoading}
                rowKey='id'
            />
        </Card>
    );
};

export default observer(BackpackCalendarPlan);