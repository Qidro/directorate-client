import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Menu, message, Row, Skeleton, Space, Tooltip, Typography} from "antd";
import {BookOutlined, EditOutlined} from "@ant-design/icons";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import Members from "./subpages/Members/Members";
import {backpackMenu} from "../../constants/menu";
import {observer} from "mobx-react-lite";
import BackpackModal from "../../components/BackpackModal/BackpackModal";
import {IBackpackForm} from "../../types/forms";
import {useStore} from '../../store';
import useMenu from "../../hooks/useMenu";
import {useLogs} from "../../hooks/useLogs";
import LogsApi from "../../api/logs-api";
import LogsModal from "../../components/LogsModal/LogsModal";
import {roleRequired} from "../../utils/roleRequired";
import {checkStore} from "../../utils/checkStore";
import CardTitle from "../../components/CardTitle/CardTitle";

const {Text, Title} = Typography;

const Backpack = () => {
    const {
        user: userStore,
        backpack: backpackStore
    } = useStore();
    const navigate = useNavigate();
    const {backpackId} = useParams();

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);

    const [logsOpen, setLogsOpen] = useState<boolean>(false)
    const [logs, loadLogs, logsLoading] = useLogs(LogsApi.getBackpackLogs, parseInt(backpackId!))

    const [menu, selectedMenu] = useMenu(backpackMenu)

    const updateBackpack = async (data: IBackpackForm) => {
        setUpdateLoading(true);
        try {
            await backpackStore.update(data);
            setModalOpen(false);
        } catch (e) {
            message.error('Ошибка сохранения изменений!');
        }
        setUpdateLoading(false);
    }

    useEffect(() => {
        const fetchBackpack = async () => {
            try {
                await backpackStore.getBackpack(backpackId!);
            } catch (e) {
                message.error('Портфель не найден!');
                navigate('/backpack');
            }
        }

        const fetchRoles = async () => {
            try {
                await backpackStore.getRoles();
            } catch (e) {
                message.error('Ошибка загрузки ролей!');
            }
        }

        fetchBackpack().then();
        fetchRoles().then();
    }, [backpackStore, navigate, backpackId]);

    return (
        <>
            <Card style={{marginBottom: 20}}>
                <CardTitle>
                    {
                        checkStore([backpackStore.backpack])
                            ?
                            <Space direction='vertical' size='middle' wrap={true}>
                                <Space direction='horizontal' align='center' size='middle' wrap={true}>
                                    <Title level={4}
                                           style={{marginBottom: 0}}>№{backpackStore.backpack.id} {backpackStore.backpack.name}</Title>
                                </Space>
                                <Text
                                    type="secondary">Руководитель: {backpackStore.backpack.users.find(user => user.role.slug === 'SUPERVISOR')?.fullname}</Text>
                            </Space>
                            : <Skeleton.Input active size={"small"}/>
                    }
                    {
                        checkStore([backpackStore.backpack])
                            ? <Space size='small'>
                                {
                                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMINISTRATOR'], backpackStore.backpack.users) &&
                                    <Tooltip title="Редактировать портфель">
                                        <Button type='dashed'
                                                icon={<EditOutlined/>}
                                                onClick={() => setModalOpen(true)}
                                        ></Button>
                                    </Tooltip>
                                }
                                <Tooltip title="Журнал действий">
                                    <Button type='dashed' icon={<BookOutlined />} onClick={() => setLogsOpen(true)}></Button>
                                </Tooltip>
                            </Space>
                            : <Skeleton.Input active size={"small"}/>
                    }
                </CardTitle>
                <Menu mode='horizontal' style={{marginTop: 15}} selectedKeys={selectedMenu} items={menu}></Menu>
            </Card>
            <Row gutter={[20, 20]}>
                <Col lg={18} xs={24}>
                    <Outlet/>
                </Col>
                <Col lg={6} xs={24}>
                    <Members/>
                </Col>
            </Row>

            <BackpackModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={updateBackpack}
                initialValues={{name: backpackStore.backpack.name, description: backpackStore.backpack.description}}
                loading={updateLoading}
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

export default observer(Backpack);