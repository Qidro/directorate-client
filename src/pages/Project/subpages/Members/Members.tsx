import {useState} from 'react';
import {Button, Card, Descriptions, message, Skeleton, Space, Tooltip, Typography} from "antd";
import {observer} from "mobx-react-lite";
import style from './Members.module.scss'
import {EditOutlined} from "@ant-design/icons";
import MembersModal from "../../../../components/MembersModal/MembersModal";
import {useStore} from "../../../../store";
import {roleRequired} from "../../../../utils/roleRequired";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography

const Members = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [loadingFields, setLoadingFields] = useState<number[]>([])

    const {
        user: userStore,
        project: projectStore
    } = useStore()

    const onSelect = async (userId: number, roleId: number) => {
        message.loading('Добавление участника')
        setLoadingFields(prev => [...prev, roleId])
        await projectStore.addUserRole(userId, roleId)
        setLoadingFields(prev => prev.filter(item => item !== roleId))
        message.destroy()
    }

    const onDeselect = async (userId: number, roleId: number) => {
        message.loading('Удаление участника')
        setLoadingFields(prev => [...prev, roleId])
        await projectStore.removeUserRole(userId, roleId)
        setLoadingFields(prev => prev.filter(item => item !== roleId))
        message.destroy()
    }

    return (
        <div className={style.members}>
            <Card>
                <div className={style.title}>
                    <Title level={4}>Участники проекта</Title>
                    {
                        checkStore([projectStore.project, userStore.user]) &&
                        projectStore.editable &&
                        roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) &&
                        <Tooltip title="Редактировать участников">
                            <Button type='dashed' icon={<EditOutlined/>} onClick={() => setModalOpen(true)}></Button>
                        </Tooltip>
                    }
                </div>
                {
                    checkStore([projectStore.project])
                    ?
                    <Descriptions layout="vertical" column={1} >
                        {
                            projectStore.roles?.map((role, index) =>
                                <Descriptions.Item label={role.name} key={index}>
                                    <Space direction='vertical' align='start' size='small'>
                                        {
                                            projectStore.project.users.filter(user => user.role.slug === role.slug).length > 0
                                                ?
                                                projectStore.project.users.filter(user => user.role.slug === role.slug)
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
                    : <Skeleton active></Skeleton>}
            </Card>

            <MembersModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                roles={projectStore.roles}
                initialValues={projectStore.project.users}
                onSelect={onSelect}
                onDeselect={onDeselect}
                loadingFields={loadingFields}
            />
        </div>
    );
};

export default observer(Members);