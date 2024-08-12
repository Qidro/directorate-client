import {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Card, Typography} from "antd";
import ResizableAntdTable from "resizable-antd-table";
import {ITableDataType, getColumns} from "./tableData";
import {IResult} from "../../../../types/result";
import ResultApi from "../../../../api/result-api";
import ResultModal from "../../../../components/ResultModal/ResultModal";
import {IResultForm} from "../../../../types/forms";
import {useParams} from "react-router-dom";
import { useStore } from '../../../../store';
import {roleRequired} from "../../../../utils/roleRequired";
import {checkStore} from "../../../../utils/checkStore";
import CardTitle from "../../../../components/CardTitle/CardTitle";

const {Title} = Typography;

const resultsToTable = (results: IResult[]) => {
    return results.map(item => ({
        key: item.id,
        name: item.name,
        status: item.status,
        responsibleUsers: item.users.filter(user => user.role.slug === 'RESPONSIBLE')
    }))
}

const Results = () => {
    const [resultModalOpen, setResultModalOpen] = useState<boolean>(false)
    const [tableData, setTableData] = useState<ITableDataType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [onCreating, setOnCreating] = useState<boolean>(false)
    const {projectId} = useParams();

    const {
        user: userStore,
        project: projectStore,
    } = useStore();

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true)

            const res = await ResultApi.getByProject(projectId!)
            setTableData(resultsToTable(res.data))

            setLoading(false)
        }
        fetchResults().then()
    }, [projectId])

    const onRemove = async (id: number) => {
        setLoading(true)
        await ResultApi.remove(id)
        setTableData(prev => prev.filter(item => item.key !== id))
        setLoading(false)
    }

    const onCreateHandler = async (data: IResultForm) => {
        setOnCreating(true)

        const res = await ResultApi.create(
            projectStore.project.id,
            data.name,
            data.type,
            data.unitsMeasure,
            data.characteristic,
            data.approvalDoc
        )

        setTableData(prev => [...prev, ...resultsToTable([res.data])])
        setOnCreating(false)
        setResultModalOpen(false)
    }

    return (
        <Card>
            <CardTitle block>
                <Title level={4}>Результаты проекта</Title>
                {
                    checkStore([projectStore.project, userStore.user]) &&
                    projectStore.editable &&
                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) &&
                    <Button type='primary' onClick={() => setResultModalOpen(true)}>Добавить результат</Button>
                }
            </CardTitle>

            <ResizableAntdTable
                columns={getColumns(onRemove, projectStore.editable, projectStore.project.id,
                    checkStore([projectStore.project, userStore.user]) &&
                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users)
                )}
                bordered
                dataSource={tableData}
                loading={loading}
                scroll={{x: 800}}
                pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
                rowClassName='tableRow'
            />

            <ResultModal
                open={resultModalOpen}
                onClose={() => setResultModalOpen(false)}
                onSubmit={onCreateHandler}
                loading={onCreating}
            />
        </Card>
    );
};

export default observer(Results);