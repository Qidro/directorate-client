import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Card, Col, Menu, message, Row, Skeleton, Space, Tag, Tooltip, Typography} from "antd";
import style from "../Indicator/Indicator.module.scss";
import {BookOutlined, EditOutlined, RollbackOutlined} from "@ant-design/icons";
import {calendarPlanMenu} from "../../constants/menu";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {ICalendarPlanForm} from "../../types/forms";
import Members from "./subpages/Members/Members";
import ProjectCalendarPlanModal from "../../components/ProjectCalendarPlanModal/ProjectCalendarPlanModal";
import {getCPStatus} from "../../utils/getCPStatus";
import dayjs from "dayjs";
import CalendarPlanResults from "./subpages/Results/CalendarPlanResults";
import {useStore} from '../../store';
import ChildWorks from "./subpages/ChildWorks/ChildWorks";
import useMenu from "../../hooks/useMenu";
import LogsModal from "../../components/LogsModal/LogsModal";
import {useLogs} from "../../hooks/useLogs";
import LogsApi from "../../api/logs-api";
import {roleRequired} from "../../utils/roleRequired";
import {checkStore} from "../../utils/checkStore";

const {Title, Text} = Typography;

const CalendarPlan = () => {
    const navigate = useNavigate();
    const {projectId, calendarPlanId} = useParams();

    const [menu, selectedMenu] = useMenu(calendarPlanMenu)

    const {
        user: userStore,
        calendarPlan: calendarPlanStore,
        project: projectStore
    } = useStore()

    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [loadingEditCalendarPlan, setLoadingCalendarPlan] = useState<boolean>(false);
    const [consonantLoading, setConsonantLoading] = useState<boolean>(false);

    const [logsOpen, setLogsOpen] = useState<boolean>(false)
    const [logs, loadLogs, logsLoading] = useLogs(LogsApi.getCalendarPlanLogs, parseInt(calendarPlanId!))

    const status = getCPStatus(calendarPlanStore.calendarPlan.status);

    const updateCalendarPlan = async (data: ICalendarPlanForm) => {
        setLoadingCalendarPlan(true);
        try {
            if (data.type === 'WORK') {
                await calendarPlanStore.updateWork(data)
            } else if (data.type === 'CONTROL_POINT') {
                await calendarPlanStore.updatePoint(data)
            } else {
                await calendarPlanStore.updateStage(data)
            }
            setEditOpen(false);
        } catch (e) {
            message.error('Ошибка обновления точки!');
        }
        setLoadingCalendarPlan(false);
    }

    const consonantPoint = async () => {
        setConsonantLoading(true);
        try {
            await calendarPlanStore.updateStatus(parseInt(calendarPlanId!), 'CONFIRMED')
        } catch (e) {
            message.error('Ошибка подтверждения точки!')
        }
        setConsonantLoading(false);
    }

    useEffect(() => {
        const fetchCalendarPlan = async () => {
            try {
                await calendarPlanStore.getCalendarPlan(calendarPlanId!)
            } catch (e) {
                message.error('Ошибка получения данных!');
                navigate('/projects');
            }
        };

        const fetchRoles = async () => {
            try {
                await calendarPlanStore.getRoles();
            } catch (e) {
                message.error('Ошибка загрузка ролей!');
            }
        }

        const fetchProject = async () => {
            try {
                await projectStore.getProject(projectId!);
            } catch (e) {
                message.error('Ошибка загрузки проекта!');
                navigate('/projects');
            }
        }

        fetchProject().then()
        fetchCalendarPlan().then()
        fetchRoles().then()
        // eslint-disable-next-line
    }, [calendarPlanStore, navigate, calendarPlanId])

    const onReturnToProject = () => {
        navigate('/project/' + projectStore.project.id + '/calendar_plan')
    }

    return (
        <>
            <Card style={{marginBottom: 20}}>
                <div className={style.indicator__title}>
                    {
                        checkStore([calendarPlanStore.calendarPlan])
                            ?
                            <Space direction='vertical' size='middle' wrap={true}>
                                <Space direction='horizontal' align='center' size='middle' wrap={true}>
                                    <Tooltip title='Назад к проекту'>
                                        <Button
                                            onClick={onReturnToProject}
                                            icon={<RollbackOutlined/>}
                                        ></Button>
                                    </Tooltip>
                                    <Title level={4}
                                           style={{marginBottom: 0}}>{calendarPlanStore.calendarPlan.name}</Title>
                                    <Tag color={'#' + status[1]}>{status[0]}</Tag>
                                </Space>
                                <Text
                                    type="secondary">Исполнитель: {calendarPlanStore.calendarPlan.users.find(user => user.role.slug === 'EXECUTOR')
                                    ? calendarPlanStore.calendarPlan.users.find(user => user.role.slug === 'EXECUTOR')?.fullname
                                    : 'Не назначен'}</Text>
                            </Space>
                            : <Skeleton.Input active size={"small"}/>
                    }
                    {
                        checkStore([calendarPlanStore.calendarPlan, userStore.user, projectStore.project])
                            ? <Space size='small'>
                                {
                                    projectStore.editable &&
                                    (
                                        roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) ||
                                        roleRequired(userStore.user.id, ['EXECUTOR', 'CONSONANTS'], calendarPlanStore.calendarPlan.users)
                                    ) &&
                                    <Tooltip title="Редактировать точку">
                                        <Button type='dashed' icon={<EditOutlined/>} onClick={() => setEditOpen(true)}></Button>
                                    </Tooltip>
                                }

                                <Tooltip title="Журнал действий">
                                    <Button type='dashed' icon={<BookOutlined />} onClick={() => setLogsOpen(true)}></Button>
                                </Tooltip>
                            </Space>
                            : <Skeleton.Input active size={"small"}/>
                    }
                </div>
                <Menu style={{marginTop: 15}} selectedKeys={selectedMenu} mode="horizontal" items={menu}></Menu>
            </Card>
            <Row gutter={[20, 20]}>
                <Col lg={18} xs={24}>
                    <Row gutter={[20, 20]}>
                        {
                            checkStore([calendarPlanStore.calendarPlan, projectStore.project, userStore.user]) &&
                            projectStore.editable &&
                            calendarPlanStore.calendarPlan.type !== 'STAGE' &&
                            calendarPlanStore.calendarPlan.status === 'COMPLETE' &&
                            roleRequired(userStore.user.id, ['CONSONANTS'], calendarPlanStore.calendarPlan.users)
                                ?
                                <Col xs={24}>
                                    <Card>
                                        <Title level={4}>Подтверждение выполнения</Title>
                                        <Button onClick={consonantPoint} type='primary'
                                                loading={consonantLoading}>Подтвердить</Button>
                                    </Card>
                                </Col>
                                : <></>
                        }
                        <Col xs={24}>
                            <Outlet/>
                        </Col>
                    </Row>
                </Col>
                <Col lg={6} xs={24}>
                    <Row gutter={[20, 20]}>
                        <Col xs={24}><Members/></Col>
                        <Col xs={24}>
                            {
                                calendarPlanStore.calendarPlan.type === 'STAGE'
                                    ?
                                    <ChildWorks/>
                                    :
                                    <CalendarPlanResults/>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>

            <ProjectCalendarPlanModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSubmit={updateCalendarPlan}
                titleText={calendarPlanStore.calendarPlan.name}
                submitText='Редактировать'
                loading={loadingEditCalendarPlan}
                initialValues={{
                    type: calendarPlanStore.calendarPlan.type,
                    name: calendarPlanStore.calendarPlan.name,
                    awaiting_result: calendarPlanStore.calendarPlan.awaiting_result,
                    start_date_plan: dayjs(calendarPlanStore.calendarPlan.start_date_plan),
                    start_date_forecast: dayjs(calendarPlanStore.calendarPlan.start_date_forecast),
                    start_date_fact: dayjs(calendarPlanStore.calendarPlan.start_date_fact),
                    end_date_plan: dayjs(calendarPlanStore.calendarPlan.end_date_plan),
                    end_date_forecast: dayjs(calendarPlanStore.calendarPlan.end_date_forecast),
                    end_date_fact: dayjs(calendarPlanStore.calendarPlan.end_date_fact),
                    end_date: dayjs(calendarPlanStore.calendarPlan.end_date_fact),
                    approval_doc: calendarPlanStore.calendarPlan.approval_doc,
                }}
            />

            <LogsModal
                open={logsOpen}
                logs={logs}
                onClose={() => setLogsOpen(false)}
                onScrolledToEnd={loadLogs}
                loading={logsLoading}
            />
        </>
    );
};

export default observer(CalendarPlan);