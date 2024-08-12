import {useState} from 'react';
import {Button, Card, Descriptions, Empty, message, Skeleton, Space, Tag, Tooltip, Typography} from "antd";
import {EditOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import CardTitle from "../../../../components/CardTitle/CardTitle";
import {getResultStatus} from "../../../../utils/getResultStatus";
import {Link} from "react-router-dom";
import CalendarPlanResultModal from "../../../../components/CalendarPlanResultModal/CalendarPlanResultModal";
import { useStore } from '../../../../store';
import {roleRequired} from "../../../../utils/roleRequired";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography

const CalendarPlanResults = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [loadingField, setLoadingField] = useState<boolean>(false);

    const {
        user: userStore,
        calendarPlan: calendarPlanStore,
        project: projectStore
    } = useStore()

    const onSelect = async (calendar_plan_id: number, result_id: number) => {
        message.loading('Добавление результата')
        setLoadingField(true);
        await calendarPlanStore.addResult(calendar_plan_id, result_id);
        setLoadingField(false);
        message.destroy()
    };

    const onDeselect = async (calendar_plan_id: number, result_id: number) => {
        message.loading('Удаление результата');
        setLoadingField(true);
        await calendarPlanStore.removeResult(calendar_plan_id, result_id);
        setLoadingField(false);
        message.destroy();
    };

    return (
        <>
            <Card>
                <CardTitle>
                    <Title level={4}>Достигаемые результаты</Title>
                    {
                        checkStore([calendarPlanStore.calendarPlan, projectStore.project, userStore.user]) &&
                        projectStore.editable &&
                        (
                            roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) ||
                            roleRequired(userStore.user.id, ['EXECUTOR', 'CONSONANTS'], calendarPlanStore.calendarPlan.users)
                        ) &&
                        <Tooltip title="Редактировать результаты">
                            <Button type='dashed' icon={<EditOutlined/>} onClick={() => setModalOpen(true)}></Button>
                        </Tooltip>
                    }
                </CardTitle>
                {
                    checkStore([calendarPlanStore.calendarPlan])
                        ?
                        calendarPlanStore.calendarPlan.results!.length > 0
                            ?
                                <Descriptions layout="vertical" column={1} >
                                    {
                                        calendarPlanStore.calendarPlan.results?.map((result, index) =>
                                            <Descriptions.Item key={index}>
                                                <Space direction='horizontal' align='start' size='large'>
                                                    <Link to={'/result/' + result.result.id + '/info'}>{result.result.name}</Link>
                                                    <Tag color={'#' + getResultStatus(result.result.status)[1]}>{getResultStatus(result.result.status)[0]}</Tag>
                                                </Space>
                                            </Descriptions.Item>
                                        )
                                    }
                                </Descriptions>
                            :
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        : <Skeleton active></Skeleton>
                }
            </Card>

            <CalendarPlanResultModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initialValues={calendarPlanStore.calendarPlan.results}
                onSelect={onSelect}
                onDeselect={onDeselect}
                loadingField={loadingField}
            />
        </>
    );
};

export default observer(CalendarPlanResults);