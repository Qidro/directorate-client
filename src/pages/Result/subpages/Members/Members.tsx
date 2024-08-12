import {useState} from 'react';
import style from './Members.module.scss'
import {Button, Card, Descriptions, message, Skeleton, Space, Tooltip, Typography} from "antd";
import {EditOutlined} from "@ant-design/icons";
import MembersModal from "../../../../components/MembersModal/MembersModal";
import {observer} from "mobx-react-lite";
import {useStore} from "../../../../store";
import {roleRequired} from "../../../../utils/roleRequired";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography;

const Members = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [loadingFields, setLoadingFields] = useState<number[]>([]);

    const {
        project: projectStore,
        result: resultStore,
        user: userStore
    } = useStore()

    const resultNoAchieved = ['IN_PROGRESS', 'COMPLETED'].includes(resultStore.result.status)


    const onSelect = async (userId: number, roleId: number) => {
        message.loading('Добавление на роль')
        setLoadingFields(prev => [...prev, roleId])
        await resultStore.addUserRole(userId, roleId)
        setLoadingFields(prev => prev.filter(item => item !== roleId))
        message.destroy()
    };

    const onDeselect = async (userId: number, roleId: number) => {
        message.loading('Удаление с роли')
        setLoadingFields(prev => [...prev, roleId])
        await resultStore.removeUserRole(userId, roleId)
        setLoadingFields(prev => prev.filter(item => item !== roleId))
        message.destroy()
    };

    return (
        <div className={style.members}>
            <Card>
                <div className={style.title}>
                    <Title level={4}>Роли</Title>
                    {
                        checkStore([resultStore.result, projectStore.project, userStore.user]) &&
                        projectStore.editable &&
                        roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) &&
                        resultNoAchieved &&
                        <Tooltip title="Редактировать участников">
                            <Button type='dashed' icon={<EditOutlined/>} onClick={() => setModalOpen(true)}></Button>
                        </Tooltip>
                    }
                </div>
                {
                    checkStore([resultStore.result])
                        ?
                        <Descriptions layout="vertical" column={1}>
                            {
                                resultStore.roles?.map((role, index) =>
                                    <Descriptions.Item label={role.name} key={index}>
                                        <Space direction='vertical' align='start' size='small'>
                                            {
                                                resultStore.result.users.filter(user => user.role.slug === role.slug).length > 0
                                                    ?
                                                    resultStore.result.users.filter(user => user.role.slug === role.slug)
                                                        .map((item, index) => (
                                                            <div key={index}>{item.fullname}</div>
                                                        ))
                                                    : <div key={index}>Не назначен</div>
                                            }
                                        </Space>
                                    </Descriptions.Item>
                                )
                            }
                        </Descriptions>
                        : <Skeleton active></Skeleton>
                }
            </Card>

            <MembersModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                roles={resultStore.roles}
                initialValues={resultStore.result.users}
                onSelect={onSelect}
                onDeselect={onDeselect}
                loadingFields={loadingFields}
            />
        </div>
    );
};

export default observer(Members);