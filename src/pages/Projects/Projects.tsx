import React, {useEffect, useRef, useState} from 'react';
import style from "./Projects.module.scss";
import {Button, Card, message, Select, Table, Typography} from "antd";
import {getColumns, ITableDataType} from "./tableData";
import ProjectApi from "../../api/project-api";
import {IProject} from "../../types/project";
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from "../../hooks/useDocumentTitle";
import {useStore} from "../../store";
import {print} from "../../utils/print";
import {PrinterOutlined} from "@ant-design/icons";

const {Title} = Typography;

const tableFilters = [
    {
        label: 'Мои проекты',
        value: 'my',
    },
    {
        label: 'Все проекты',
        value: 'all',
        rights: ['DIRECTOR-EX', 'RECTOR']
    }
]

const projectsToTable = (projects: IProject[], currentUserId: number): ITableDataType[] => {
    return projects.map(item => {
        return {
            key: item.id,
            name: `№${item.id} ${item.name}`,
            start_date: dayjs(item.start_date).isValid() ? dayjs(item.start_date).format('DD.MM.YYYY') : '',
            end_date: dayjs(item.end_date).isValid() ? dayjs(item.end_date).format('DD.MM.YYYY') : '',
            stage: item.status,
            director: item.users.find(user => user.role.slug === 'SUPERVISOR'),
            directorate_curator: item.users.find(user => user.role.slug === 'DIRECTORATE_CURATOR'),
            curator: item.users.find(user => user.role.slug === 'CURATOR'),
            my_role: item.users.filter(item => item.id === currentUserId)
        }
    })
}

const Projects = () => {
    useDocumentTitle('Проекты')

    const {
        user: userStore
    } = useStore()

    const [projectsLoading, setProjectsLoading] = useState<boolean>(false);
    const [tableData, setTableData] = useState<ITableDataType[]>([])
    const [filters, setFilters] = useState<{label: string, value: string}[]>([])

    const tableRef = useRef<HTMLDivElement>(null)
    const [isPrint, setIsPrint] = useState<boolean>(false)

    const navigate = useNavigate();

    useEffect(() => {
        setFilters(tableFilters.filter(item =>
            item.rights
                ? item.rights.filter(right => userStore.checkRight(right)).length !== 0
                : item
        ).map(item => ({
                label: item.label,
                value: item.value,
            }))
        );

        setProjectsLoading(true);
        ProjectApi.getMyProjects().then((res) => {
            setTableData(projectsToTable(res.data, userStore.user.id));
        }).catch(() => {
            message.error('Ошибка загрузки проектов!');
        }).finally(() => {setProjectsLoading(false)})
    }, [userStore])

    const onFilterChangeHandler = async (value: any) => {
        setProjectsLoading(true)
        setTableData([])

        let projects: IProject[] = [];

        switch (value) {
            case 'my':
                projects = (await ProjectApi.getMyProjects()).data;
                break
            case 'all':
                projects = (await ProjectApi.getAllProjects()).data;
                break
        }
        setTableData(projectsToTable(projects, userStore.user.id))
        setProjectsLoading(false)
    }

    const onProjectClickHandler = (id: number) => {
        navigate('/project/'+id+'/info');
    }

    const onPrintHandler = async () => {
        setIsPrint(true)
        await print(tableRef, 'horizontal')
        setIsPrint(false)
    }

    return (
        <Card>
            <div className={style.title}>
                <Title level={4}>Проекты</Title>

                <div className={style.actions}>
                    <Button
                        type='dashed'
                        onClick={onPrintHandler}
                        icon={<PrinterOutlined />}
                        disabled={projectsLoading}
                    />

                    <Select options={filters} size='middle' defaultValue='my' onChange={onFilterChangeHandler} style={{marginBottom: 20}} disabled={projectsLoading}/>
                </div>
            </div>

            <Table
                columns={getColumns()}
                bordered
                dataSource={tableData}
                loading={projectsLoading}
                scroll={{x: isPrint ? 1000 : 1500}}
                ref={tableRef}
                rootClassName={style.table}
                onRow={(record: ITableDataType) => {
                    return {
                        onClick: () => onProjectClickHandler(record.key)
                    }
                }}
                pagination={!isPrint ? {showSizeChanger: true, position: ['topRight', 'bottomRight']} : false}
                rowClassName='tableRow'
            />
        </Card>
    );
};

export default Projects;