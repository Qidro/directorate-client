import {useEffect, useState} from 'react';
import {Card, message, Table, Typography} from "antd";
import {getColumns, getExpandedTable} from "./tableData";
import {observer} from "mobx-react-lite";
import {IBackpackProjectIndicator} from "../../../../types/backpack";
import {useParams} from "react-router-dom";
import BackpackApi from "../../../../api/backpack-api";

const {Title} = Typography;

const BackpackIndicators = () => {
    const {backpackId} = useParams();

    const [tableData, setTableData] = useState<IBackpackProjectIndicator[]>();
    const [indicatorsLoading, setIndicatorsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchIndicators = async () => {
            setIndicatorsLoading(true);

            try {
                const res = await BackpackApi.getIndicators(backpackId!);
                setTableData(res.data);
            } catch (e) {
                message.error('Ошибка загрузки показателей!');
            }

            setIndicatorsLoading(false);
        }

        fetchIndicators().then();
    }, [backpackId])

    return (
        <Card>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
                <Title level={4}>Показатели</Title>
            </div>
            <Table
                columns={getColumns()}
                expandable={{ expandedRowRender: (record) => getExpandedTable(record), defaultExpandedRowKeys: ['0'] }}
                dataSource={tableData}
                loading={indicatorsLoading}
                rowKey='id'
                bordered
            />
        </Card>
    );
};

export default observer(BackpackIndicators);