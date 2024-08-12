import {useEffect, useState} from 'react';
import {Button, Card, message, Typography} from "antd";
import {observer} from "mobx-react-lite";
import ResizableAntdTable from "resizable-antd-table";
import {getColumns, ITableDataType} from "./tableData";
import IndicatorValueModal from "../../../../components/IndicatorValueModal/IndicatorValueModal";
import {IIndicatorValueForm} from "../../../../types/forms";
import IndicatorApi from "../../../../api/indicator-api";
import {IIndicatorValue} from "../../../../types/indicator";
import dayjs from "dayjs";
import { useStore } from '../../../../store';
import {roleRequired} from "../../../../utils/roleRequired";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography;

const valuesToTable = (indicator_values: IIndicatorValue[]): ITableDataType[] => {
    return indicator_values.map(value => {
        return {
            key: value.id,
            period: value.period,
            plan_value: value.plan_value,
            forecast_value: value.forecast_value,
            actual_value: value.actual_value,
            status: value.status
        }
    })
}

const IndicatorValues = () => {
    const {
        user: userStore,
        project: projectStore,
        indicator: indicatorStore
    } = useStore()

    const [tableData, setTableData] = useState<ITableDataType[]>([]);
    const [indicatorValuesLoading, setIndicatorValuesLoading] = useState<boolean>(true);
    const [indicatorValueModalOpen, setIndicatorValueModalOpen] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState<IIndicatorValueForm>();
    const [loading, setLoading] = useState<boolean>();
    const [editValueId, setEditValueId] = useState<number>();

    const onEditValue = (indicatorValueId: number) => {
        message.loading('Загрузка значения');
        setEditValueId(indicatorValueId);
        IndicatorApi.getIndicatorValue(indicatorValueId).then((res) => {
            message.destroy();
            setInitialValues({
                period: dayjs(res.data.period).isValid() ? dayjs(res.data.period) : undefined,
                plan_value: res.data.plan_value,
                forecast_value: res.data.forecast_value,
                actual_value: res.data.actual_value
            });
            setIndicatorValueModalOpen(true);
        }).catch((error) => {
            message.destroy();
            if (error.response.data === 'Result value not found') {
                message.error('Значение не найдено!');
            }
        })
    }

    const onRemoveValue = async (indicatorValueId: number) => {
        message.loading('Удаление значения');
        try {
            await indicatorStore.removeValue(indicatorValueId);
            message.destroy();
        } catch (e) {
            message.error('Ошибка удаления значения!');
        }
    }

    const addIndicatorValue = async (data: IIndicatorValueForm) => {
        setLoading(true);
        try {
            await indicatorStore.addValue(data.period, data.plan_value, data.forecast_value, data.actual_value);
            setIndicatorValueModalOpen(false);
        } catch (e) {
            message.error('Ошибка добавления значения!');
        } finally
        {
            setLoading(false);
        }
    }

    const editIndicatorValue = async (data: IIndicatorValueForm) => {
        setLoading(true);
        try {
            await indicatorStore.updateValue(editValueId!, data.period, data.plan_value, data.forecast_value, data.actual_value);
            setIndicatorValueModalOpen(false);
        } catch (e) {
            message.error('Ошибка изменения значения!');
        } finally
        {
            setLoading(false);
        }
    }

    const closeIndicatorValueModal = () => {setIndicatorValueModalOpen(false)}

    useEffect(() => {
        if (checkStore([indicatorStore.indicator])) {
            setTableData(valuesToTable(indicatorStore.indicator.indicator_values!));
            setIndicatorValuesLoading(false)
        }
    }, [indicatorStore, indicatorStore.indicator])

    return (
        <Card>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
                <Title level={4}>Плановые, прогнозные и фактические значения показателя</Title>
                {
                    checkStore([indicatorStore.indicator, projectStore.project, userStore.user]) &&
                    projectStore.editable &&
                    (roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) ||
                        roleRequired(userStore.user.id, ['INPUT_RESPONSIBLE'], indicatorStore.indicator.users)
                    )
                    &&
                    <Button type='primary' onClick={() => {
                        setInitialValues(undefined);
                        setIndicatorValueModalOpen(true)}
                    }>Добавить значение</Button>
                }
            </div>

            <ResizableAntdTable
                columns={getColumns(onEditValue, onRemoveValue, indicatorStore.indicator, projectStore.editable,
                    checkStore([indicatorStore.indicator, projectStore.project, userStore.user]) &&
                (roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users)
                || roleRequired(userStore.user.id, ['INPUT_RESPONSIBLE'], indicatorStore.indicator.users))
                )}
                bordered
                dataSource={tableData}
                loading={indicatorValuesLoading}
                scroll={{x: 1000}}
                pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
            />

            <IndicatorValueModal
                open={indicatorValueModalOpen}
                onClose={closeIndicatorValueModal}
                onSubmit={initialValues ? editIndicatorValue : addIndicatorValue}
                initialValues={initialValues}
                loading={loading}
            />
        </Card>
    );
};

export default observer(IndicatorValues);