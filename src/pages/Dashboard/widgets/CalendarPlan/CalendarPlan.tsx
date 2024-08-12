import React, {FC, useMemo} from 'react';
import CardTitle from "../../../../components/CardTitle/CardTitle";
import {Card, Table, Typography} from "antd";
import {ICalendarPlanProps} from "./ICalendarPlanProps";
import {columns, ITableDataType} from "./tableData";
import dayjs from "dayjs";

const {Title} = Typography;

const CalendarPlan: FC<ICalendarPlanProps> = ({calendarPlans, loading, verticalScroll}) => {
    const data: ITableDataType[] = useMemo(() => {
        return calendarPlans.map(item => ({
            key: item.id,
            id: item.id,
            name: item.name,
            type: item.type,
            status: item.status,
            projectId: item.project.id,
            projectName: item.project.name,
            endDate: dayjs(item.end_date_plan).format('DD.MM.YYYY')
        }))
    }, [calendarPlans])

    return (
        <Card style={{height: '100%'}}>
            <CardTitle>
                <Title level={4}>Мой календарный план</Title>
            </CardTitle>
            <Table
                bordered
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={false}
                scroll={{x: 600, y: verticalScroll}}
                size='small'
            />
        </Card>
    );
};

export default React.memo(CalendarPlan);