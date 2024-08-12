import React, {useState} from 'react';
import {Button, Card, Typography} from "antd";
import {observer} from "mobx-react-lite";
import ResizableAntdTable from "resizable-antd-table";
import {getColumns, ITableDataType} from "./tableData";
import {IResultValue} from "../../../../types/result";
import {IResultValueForm} from "../../../../types/forms";
import ResultValueModal from "../../../../components/ResultValueModal/ResultValueModal";
import dayjs from "dayjs";
import { useStore } from '../../../../store';
import {roleRequired} from "../../../../utils/roleRequired";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography;

const valuesToTable = (values: IResultValue[]): ITableDataType[] => {
    return values.map(value => ({
        key: value.id,
        achievementDate: value.achievement_date,
        unitsMeasure: value.units_measure,
        planValue: value.plan,
        forecastValue: value.forecast
    }))
}

const ResultValues = () => {
    const {
        user: userStore,
        project: projectStore,
        result: resultStore
    } = useStore()
    
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [modalLoading, setModalLoading] = useState<boolean>(false)
    const [editingValueId, setEditingValueId] = useState<number>()
    const [modalType, setModalType] = useState<'create' | 'edit'>('create')

    const resultNoAchieved = ['IN_PROGRESS', 'COMPLETED'].includes(resultStore.result.status)

    const onEditClick = async (id: number) => {
        setEditingValueId(id)
        setModalOpen(true)
        setModalType('edit')
    }

    const onCreateClick = () => {
        setModalOpen(true)
        setModalType('create')
    }

    const onCreate = async (data: IResultValueForm) => {
        setModalLoading(true)
        await resultStore.createValue(data)
        setModalLoading(false)
        setModalOpen(false)
    }

    const onRemove = async (id: number) => {
        await resultStore.removeValue(id)
    }

    const onEdit = async (values: IResultValueForm) => {
        if (!editingValueId) return

        setModalLoading(true)
        await resultStore.updateValue(editingValueId, values)
        setModalLoading(false)
        setModalOpen(false)
    }

    const getInitialValues = () => {
        const value = resultStore.values.find(item => item.id === editingValueId)
        return value ? {
            achievementDate: dayjs(value.achievement_date).isValid() ? dayjs(value.achievement_date) : undefined,
            planValue: value.plan,
            forecastValue: value.forecast
        } : undefined
    }

    return (
        <Card>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
                <Title level={4}>Значения результата</Title>
                {
                    checkStore([resultStore.result, projectStore.project, userStore.user]) &&
                    projectStore.editable &&
                    (roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) ||
                        roleRequired(userStore.user.id, ['RESPONSIBLE'], resultStore.result.users)
                    ) && resultNoAchieved &&
                    <Button type='primary' onClick={onCreateClick}>Добавить значение</Button>
                }
            </div>

            <ResizableAntdTable
                bordered
                loading={resultStore.valuesLoading}
                columns={getColumns(onEditClick, onRemove, projectStore.editable,
                    checkStore([resultStore.result, projectStore.project, userStore.user]) &&
                    (roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) ||
                        roleRequired(userStore.user.id, ['RESPONSIBLE'], resultStore.result.users)
                    ), resultNoAchieved
                    )}
                dataSource={valuesToTable(resultStore.values)}
                scroll={{x: 800}}
                pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
            />

            <ResultValueModal
                open={modalOpen}
                loading={modalLoading}
                onClose={() => setModalOpen(false)}
                onSubmit={modalType === 'edit' ? onEdit : onCreate}
                initialValues={modalType === 'edit' ? getInitialValues() : undefined}
                submitText={modalType === 'edit' ? 'Сохранить' : undefined}
                titleText={modalType === 'edit' ? 'Редактирование значения' : undefined}
            />
        </Card>
    );
};

export default observer(ResultValues);