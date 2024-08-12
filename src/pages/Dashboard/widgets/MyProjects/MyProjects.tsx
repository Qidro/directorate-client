import React, {FC, useMemo} from 'react';
import {IMyProjectsProps} from "./IMyProjectsProps";
import {Card, Table, Typography} from "antd";
import {columns, ITableDataType} from "./tableData";
import CardTitle from "../../../../components/CardTitle/CardTitle";

const {Title} = Typography;


const MyProjects: FC<IMyProjectsProps> = ({projects, loading = false, verticalScroll}) => {
    const data: ITableDataType[] = useMemo(() => {
        return projects.map(item => ({
            key: item.id,
            name: item.name,
            status: item.status
        }))
    }, [projects])

    return (
        <Card style={{height: '100%'}}>
            <CardTitle>
                <Title level={4}>Мои проекты</Title>
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

export default React.memo(MyProjects);