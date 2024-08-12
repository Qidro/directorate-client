import {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Card, message, Typography} from "antd";
import ResizableAntdTable from "resizable-antd-table";
import {getColumns, ITableDataType} from "./tableData";
import IndicatorModal from "../../../../components/IndicatorModal/IndicatorModal";
import {IIndicatorForm} from "../../../../types/forms";
import {useParams} from "react-router-dom";
import {IProjectIndicator} from "../../../../types/indicator";
import IndicatorApi from "../../../../api/indicator-api";
import { useStore } from '../../../../store';
import {roleRequired} from "../../../../utils/roleRequired";
import {checkStore} from "../../../../utils/checkStore";
import CardTitle from "../../../../components/CardTitle/CardTitle";

const {Title} = Typography;

const indicatorToTable = (indicators: IProjectIndicator[]): ITableDataType[] => {
    return indicators.map(indicator => {
        return {
            key: indicator.id,
            name: indicator.name,
            units_measure: indicator.units_measure,
            plan_value: indicator.plan_value,
            forecast_value: indicator.forecast_value,
            actual_value: indicator.actual_value,
            base_value: indicator.base_value,
            responsible_user: indicator.users.find(user => user.role.slug === 'RESPONSIBLE')?.fullname,
            status: indicator.status
        }
    })
}

const Indicators = () => {
    const {projectId} = useParams();

    const {
        project: projectStore,
        user: userStore,
    } = useStore();

    const [indicatorsLoading, setIndicatorsLoading] = useState<boolean>();
    const [indicatorModalOpen, setIndicatorModalOpen] = useState<boolean>(false);
    const [addingIndicator, setAddingIndicator] = useState<boolean>();
    const [tableData, setTableData] = useState<ITableDataType[]>([]);

    const onAddIndicatorSubmit = async (data: IIndicatorForm) => {
        setAddingIndicator(true);

        try {
            const res = await IndicatorApi.add(
                projectStore.project.id,
                data.name,
                data.evaluation_type,
                data.evaluation_frequency,
                data.units_measure ? data.units_measure : '',
                data.base_value,
                data.base_value_date ? data.base_value_date : '0000-00-00',
                data.description,
                data.info_collection ? data.info_collection : '',
                data.coverage_units ? data.coverage_units : '',
                data.approval_doc
            );

            setTableData([...tableData, {
                key: res.data.id,
                name: res.data.name,
                units_measure: res.data.units_measure,
                plan_value: res.data.plan_value,
                forecast_value: res.data.forecast_value,
                actual_value: res.data.actual_value,
                base_value: res.data.base_value,
                responsible_user: res.data.users.find(user => user.role.slug === 'RESPONSIBLE')?.fullname,
                status: 'AWAITING'
            }]);

            setIndicatorModalOpen(false);
        } catch (e) {
            message.error('Ошибка добавления показателя!');
        }
        setAddingIndicator(false);
    }

    const onRemoveIndicator = async (indicatorId: number) => {
        message.loading('Удаление показателя');

        try {
            await IndicatorApi.delete(indicatorId);
            setTableData(tableData?.filter(item => item.key !== indicatorId));
            message.destroy();
        } catch (e) {
            message.destroy();
            message.error('Ошибка удаление показателя!');
        }
    }

    useEffect(() => {
        const fetchIndicators = async () => {
            setIndicatorsLoading(true);

            try {
                const res = await IndicatorApi.getIndicators(projectId!);
                setTableData(indicatorToTable(res.data));
            } catch (e) {
                message.error('Ошибка загрузки показателей!');
            }

            setIndicatorsLoading(false);
        }

        fetchIndicators().then();
    }, [projectId])

    return (
        <Card>
            <CardTitle block>
                <Title level={4}>Показатели проекта</Title>
                {
                    checkStore([projectStore.project, userStore.user]) &&
                    projectStore.editable &&
                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) &&
                    <Button type='primary' onClick={() => setIndicatorModalOpen(true)}>Добавить показатель</Button>
                }
            </CardTitle>

            <ResizableAntdTable
                columns={getColumns(onRemoveIndicator, projectStore.editable, projectStore.project.id,
                    checkStore([projectStore.project, userStore.user]) &&
                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users))}
                bordered
                dataSource={tableData}
                loading={indicatorsLoading}
                scroll={{x: 1400}}
                pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
                rowClassName='tableRow'
            />

            <IndicatorModal
                open={indicatorModalOpen}
                onClose={() => setIndicatorModalOpen(false)}
                loading={addingIndicator}
                onSubmit={onAddIndicatorSubmit}
            />
        </Card>
    );
};

export default observer(Indicators);