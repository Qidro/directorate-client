import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Menu, message, Row, Skeleton, Space, Tag, Tooltip, Typography} from "antd";
import style from './Result.module.scss'
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {BookOutlined, EditOutlined, RollbackOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {resultMenu} from "../../constants/menu";
import Members from "./subpages/Members/Members";
import ResultModal from "../../components/ResultModal/ResultModal";
import {IResultForm} from "../../types/forms";
import {getResultStatus} from "../../utils/getResultStatus";
import Performing from "./subpages/Performing/Performing";
import {useStore} from "../../store"
import useMenu from "../../hooks/useMenu";
import {useLogs} from "../../hooks/useLogs";
import LogsApi from "../../api/logs-api";
import LogsModal from "../../components/LogsModal/LogsModal";
import {roleRequired} from "../../utils/roleRequired";
import {checkStore} from "../../utils/checkStore";

const {Title} = Typography;

const Result = () => {
    const {
        user: userStore,
        project: projectStore,
        result: resultStore
    } = useStore()

    const [menu, selectedMenu] = useMenu(resultMenu)

    const {projectId, resultId} = useParams();
    const navigate = useNavigate();

    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [loadingEdit, setLoadingEdit] = useState<boolean>(false);

    const [logsOpen, setLogsOpen] = useState<boolean>(false)
    const [logs, loadLogs, logsLoading] = useLogs(LogsApi.getResultLogs, parseInt(resultId!))

    const status = getResultStatus(resultStore.result.status);
    const resultNoAchieved = ['IN_PROGRESS', 'COMPLETED'].includes(resultStore.result.status)

    useEffect(() => {
        const fetchResult = async () => {
            try {
                await resultStore.fetchResult(resultId!);
            } catch (e) {
                message.error('Ошибка загрузки результата!');
                navigate('/project/' + projectStore.project.id);
            }
        }

        const fetchRoles = async () => {
            try {
                await resultStore.fetchRoles();
            } catch (e) {
                message.error('Ошибка загрузка ролей!');
            }
        }

        const fetchValues = async () => {
            try {
                await resultStore.fetchValues(resultId!)
            } catch (e) {
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
        fetchResult().then()
        fetchRoles().then()
        fetchValues().then()
        // eslint-disable-next-line
    }, [resultStore, navigate, resultId])

    const updateResult = async (data: IResultForm) => {
        setLoadingEdit(true);

        try {
            await resultStore.updateResult(data)
            setOpenEdit(false);
        } catch (e) {
            message.error('Ошибка обновления данных результата!');
        }

        setLoadingEdit(false);
    }

    const onReturnToProject = () => {
        navigate('/project/' + projectStore.project.id + '/results')
    }

    return (
        <>
            <Card style={{marginBottom: 20}}>
                <div className={style.title}>
                    {
                        checkStore([resultStore.result])
                            ?
                            <Space direction='vertical' size='middle' wrap={true}>
                                <Space direction='horizontal' align='center' size='middle' wrap={true}>
                                    <Tooltip title='Назад к проекту'>
                                        <Button
                                            onClick={onReturnToProject}
                                            icon={<RollbackOutlined/>}
                                        ></Button>
                                    </Tooltip>
                                    <Title level={4} style={{marginBottom: 0}}>{resultStore.result.name}</Title>
                                    <Tag color={'#' + status[1]}>{status[0]}</Tag>
                                </Space>
                            </Space>
                            : <Skeleton.Input active size={"small"}/>
                    }
                    {
                        checkStore([resultStore.result])
                            ? <Space>
                                {
                                    checkStore([projectStore.project, userStore.user]) &&
                                    projectStore.editable &&
                                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users)
                                    && resultNoAchieved &&
                                    <Tooltip title="Редактировать результат">
                                        <Button type='dashed' icon={<EditOutlined/>} onClick={() => setOpenEdit(true)}></Button>
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
                    {
                        checkStore([resultStore.result, projectStore.project, userStore.user]) &&
                        projectStore.editable &&
                        (roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) ||
                        roleRequired(userStore.user.id, ['COORDINATOR', 'RESPONSIBLE'], resultStore.result.users))
                        && resultNoAchieved
                        && <Performing/>
                    }
                    <Outlet/>
                </Col>
                <Col lg={6} xs={24}>
                    <Members/>
                </Col>
            </Row>

            <ResultModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                onSubmit={updateResult}
                titleText={resultStore.result.name}
                submitText='Сохранить'
                initialValues={{
                    name: resultStore.result.name,
                    type: resultStore.result.type,
                    unitsMeasure: resultStore.result.units_measure,
                    characteristic: resultStore.result.characteristic,
                    approvalDoc: resultStore.result.approval_doc,
                }}
                loading={loadingEdit}
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

export default observer(Result);