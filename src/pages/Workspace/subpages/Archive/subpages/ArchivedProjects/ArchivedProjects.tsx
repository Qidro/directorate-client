import React, {useEffect, useState} from 'react';
import {message, Table} from "antd";
import {IProject} from "../../../../../../types/project";
import dayjs from "dayjs";
import {getColumns, ITableData} from "./tableData";
import ProjectApi from "../../../../../../api/project-api";

const projectsToTable = (projects: IProject[]): ITableData[] => {
    return projects.map(item => {
        return {
            key: item.id,
            name: `№${item.id} ${item.name}`,
            start_date: dayjs(item.start_date).isValid() ? dayjs(item.start_date).format('DD.MM.YYYY') : '',
            end_date: dayjs(item.end_date).isValid() ? dayjs(item.end_date).format('DD.MM.YYYY') : '',
            stage: item.status,
            director: item.users.find(user => user.role.slug === 'SUPERVISOR'),
            admins: item.users.filter(user => user.role.slug === 'DIRECTORATE_CURATOR'),
            curator: item.users.find(user => user.role.slug === 'CURATOR')
        }
    })
}

const ArchivedProjects = () => {
    const [projects, setProjects] = useState<IProject[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true)
            const res = await ProjectApi.getArchivedProjects()
            setProjects(res.data)
            setLoading(false)
        }

        fetchProjects().then()
    }, []);

    const onRestore = async (id: number) => {
        message.loading('Восстановление проекта');
        setLoading(true)

        try {
            await ProjectApi.restoreProject(id)
            setProjects(prev => prev.filter(project => project.id !== id))
            message.destroy();
            message.success('Проект восстановлен!');
        } catch (_) {
            message.destroy();
            message.error('Ошибка при восстановлении проекта');
        }

        setLoading(false)
    }

    return (
        <Table
            bordered
            columns={getColumns(onRestore)}
            dataSource={projectsToTable(projects)}
            loading={loading}
            pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
            scroll={{x: 1500}}
        />
    );
};

export default ArchivedProjects;