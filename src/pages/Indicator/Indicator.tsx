import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Menu, message, Row, Skeleton, Space, Tag, Tooltip, Typography} from "antd";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {BookOutlined, EditOutlined, RollbackOutlined} from "@ant-design/icons";
import style from './Indicator.module.scss'
import {getIndicatorStatus} from "../../utils/getIndicatorStatus";
import {indicatorMenu} from "../../constants/menu";
import Members from './subpages/Members/Members'
import {observer} from "mobx-react-lite";
import IndicatorModal from "../../components/IndicatorModal/IndicatorModal";
import {IIndicatorForm} from "../../types/forms";
import {useStore} from "../../store";
import useMenu from "../../hooks/useMenu";
import LogsModal from "../../components/LogsModal/LogsModal";
import {useLogs} from "../../hooks/useLogs";
import LogsApi from "../../api/logs-api";
import {roleRequired} from "../../utils/roleRequired";
import {checkStore} from "../../utils/checkStore";

const {Title, Text} = Typography;

const Indicator = () => {
    const {projectId, indicatorId} = useParams();
    const navigate = useNavigate();

    const [menu, selectedMenu] = useMenu(indicatorMenu)

    const {
        project: projectStore,
        indicator: indicatorStore,
        user: userStore
    } = useStore()

    const status = getIndicatorStatus(indicatorStore.indicator.status);

    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [loadingEditIndicator, setLoadingEditIndicator] = useState<boolean>(false);

    const [logsOpen, setLogsOpen] = useState<boolean>(false)
    const [logs, loadLogs, logsLoading] = useLogs(LogsApi.getIndicatorLogs, parseInt(indicatorId!))

    const updateIndicator = async (data: IIndicatorForm) => {
        setLoadingEditIndicator(true);

        try {
            await indicatorStore.updateIndicator(data)
            setOpenEdit(false);
        } catch (e) {
            message.error('Ошибка обновления данных показателя!');
        }

        setLoadingEditIndicator(false);
    }

    useEffect(() => {
        const fetchProject = async () => {
            try {
                await projectStore.getProject(projectId!);
            } catch (e) {
                message.error('Ошибка загрузки проекта!');
                navigate('/projects');
            }
        }

        const fetchIndicator = async () => {
            try {
                await indicatorStore.getIndicator(indicatorId!);
            } catch (e) {
                message.error('Ошибка загрузки показателя!');
                navigate('/project/' + projectStore.project.id);
            }
        };

        const fetchRoles = async () => {
            try {
                await indicatorStore.getRoles();
            } catch (e) {
                message.error('Ошибка загрузка ролей!');
            }
        };

        fetchProject().then()
        fetchIndicator().then();
        fetchRoles().then();
        // eslint-disable-next-line
    }, [indicatorStore, navigate, indicatorId])


    const onReturnToProject = () => {
        navigate('/project/' + projectStore.project.id + '/indicators')
    }

    return (
        <>
            <Card style={{marginBottom: 20}}>
                <div className={style.indicator__title}>
                    {
                        checkStore([indicatorStore.indicator])
                            ?
                            <Space direction='vertical' size='middle' wrap={true}>
                                <Space direction='horizontal' align='center' size='middle' wrap={true}>
                                    <Tooltip title='Назад к проекту'>
                                        <Button
                                            onClick={onReturnToProject}
                                            icon={<RollbackOutlined/>}
                                        ></Button>
                                    </Tooltip>
                                    <Title level={4} style={{marginBottom: 0}}>{indicatorStore.indicator.name}</Title>
                                    <Tag color={'#' + status[1]}>{status[0]}</Tag>
                                </Space>
                                <Text
                                    type="secondary">Ответственный: {indicatorStore.indicator.users.find(user => user.role.slug === 'RESPONSIBLE')
                                    ? indicatorStore.indicator.users.find(user => user.role.slug === 'RESPONSIBLE')?.fullname
                                    : 'Не назначен'}</Text>
                            </Space>
                            : <Skeleton.Input active size={"small"}/>
                    }
                    {
                        checkStore([indicatorStore.indicator])
                            ? <Space size='small'>
                                {
                                    checkStore([projectStore.project, userStore.user]) &&
                                    projectStore.editable &&
                                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) &&
                                    <Tooltip title="Редактировать показатель">
                                        <Button type='dashed' icon={<EditOutlined/>}
                                                onClick={() => setOpenEdit(true)}></Button>
                                    </Tooltip>
                                }

                                <Tooltip title="Журнал действий">
                                    <Button type='dashed' icon={<BookOutlined/>} onClick={() => setLogsOpen(true)}></Button>
                                </Tooltip>
                            </Space>
                            : <Skeleton.Input active size={"small"}/>
                    }
                </div>
                <Menu style={{marginTop: 15}} selectedKeys={selectedMenu} mode="horizontal" items={menu}></Menu>
            </Card>

            <Row gutter={[20, 20]}>
                <Col lg={18} xs={24}>
                    <Outlet/>
                </Col>
                <Col lg={6} xs={24}>
                    <Members/>
                </Col>
            </Row>

            <IndicatorModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                onSubmit={updateIndicator}
                titleText={indicatorStore.indicator.name}
                submitText='Сохранить'
                initialValues={indicatorStore.indicator}
                loading={loadingEditIndicator}
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

export default observer(Indicator);