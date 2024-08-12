import {useState} from 'react';
import {Button, Card, Popconfirm, Space, Spin, Typography} from "antd";
import {observer} from "mobx-react-lite";
import {ResultStatus} from "../../../../types/result";
import { useStore } from '../../../../store';
import {roleRequired} from "../../../../utils/roleRequired";
import {checkStore} from "../../../../utils/checkStore";


const {Title} = Typography;

const Performing = () => {
    const {
        result: resultStore,
        project: projectStore,
        user: userStore
    } = useStore()
    
    const [loading, setLoading] = useState<boolean>(false)

    const changeStatus = async (status: ResultStatus) => {
        setLoading(true)
        await resultStore.updateStatus(status)
        setLoading(false)
    }

    return (
        <Card style={{marginBottom: 20}}>
            <Spin spinning={loading}>
                <Title level={4}>Выполнение</Title>

                {
                    checkStore([resultStore.result, projectStore.project, userStore.user]) &&
                    resultStore.result.status === 'IN_PROGRESS' &&
                    (roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) ||
                    roleRequired(userStore.user.id, ['RESPONSIBLE'], resultStore.result.users))
                    ?
                    <Space size='small'>
                        <Popconfirm
                            title="Подтверждение выполнения результата"
                            description="Вы уверены, что хотите подтвердить выполнение результата?"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => changeStatus('COMPLETED')}
                        >
                            <Button type='primary'>Выполнить</Button>
                        </Popconfirm>
                        <Popconfirm
                            title="Отмена выполнения результата"
                            description="Вы уверены, что хотите отменить выполнение результата?"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => changeStatus('CANCELED')}
                        >
                            <Button>Отменить</Button>
                        </Popconfirm>

                    </Space>
                    :
                    <></>
                }

                {
                    checkStore([resultStore, projectStore.project, userStore.user]) &&
                    resultStore.result.status === 'COMPLETED' &&
                    (roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) ||
                    roleRequired(userStore.user.id, ['COORDINATOR'], resultStore.result.users))
                    ?
                    <Space size='small'>
                        <Popconfirm
                            title="Согласование выполнения результата"
                            description="Вы уверены, что хотите согласовать выполнение результата?"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => changeStatus('ACHIEVED')}
                        >
                            <Button type='primary'>Согласовать</Button>
                        </Popconfirm>
                        <Popconfirm
                            title="Отклонение выполнения результата"
                            description="Вы уверены, что хотите отклонить выполнение результата?"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => changeStatus('IN_PROGRESS')}
                        >
                            <Button>Отклонить</Button>
                        </Popconfirm>
                    </Space>
                    :
                    <></>
                }
            </Spin>
        </Card>
    );
};

export default observer(Performing);