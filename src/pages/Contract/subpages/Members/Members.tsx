import {useState} from 'react';
import {Button, Card, Descriptions, message, Skeleton, Space, Tooltip, Typography} from "antd";
import {EditOutlined} from "@ant-design/icons";
import MembersModal from "../../../../components/MembersModal/MembersModal";
import {observer} from "mobx-react-lite";
import CardTitle from "../../../../components/CardTitle/CardTitle";
import {useStore} from "../../../../store";
import {roleRequired} from "../../../../utils/roleRequired";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography

const Members = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [loadingFields, setLoadingFields] = useState<number[]>([]);

    const {
        project: projectStore,
        user: userStore,
        contract: contractStore
    } = useStore()

    const onSelect = async (userId: number, roleId: number) => {
        message.loading('Добавление на роль')
        setLoadingFields(prev => [...prev, roleId])
        await contractStore.addUserRole(userId, roleId)
        setLoadingFields(prev => prev.filter(item => item !== roleId))
        message.destroy()
    };

    const onDeselect = async (userId: number, roleId: number) => {
        message.loading('Удаление с роли')
        setLoadingFields(prev => [...prev, roleId])
        await contractStore.removeUserRole(userId, roleId)
        setLoadingFields(prev => prev.filter(item => item !== roleId))
        message.destroy()
    };

    return (
        <Card>
            <CardTitle>
                <Title level={4}>Роли</Title>
                {
                    checkStore([contractStore.contract, projectStore.project, userStore.user]) &&
                    projectStore.editable &&
                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) &&
                    <Tooltip title="Редактировать участников">
                        <Button type='dashed' icon={<EditOutlined/>} onClick={() => setModalOpen(true)}></Button>
                    </Tooltip>
                }
            </CardTitle>
            {
                checkStore([contractStore.contract])
                    ?
                    <Descriptions layout="vertical" column={1} >
                        {
                            contractStore.roles?.map((role, index) =>
                                <Descriptions.Item label={role.name} key={index}>
                                    <Space direction='vertical' align='start' size='small'>
                                        {
                                            contractStore.contract.users.filter(user => user.role.slug === role.slug).length > 0
                                                ?
                                                contractStore.contract.users.filter(user => user.role.slug === role.slug)
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

            <MembersModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                roles={contractStore.roles}
                initialValues={contractStore.contract.users}
                onSelect={onSelect}
                onDeselect={onDeselect}
                loadingFields={loadingFields}
            />
        </Card>
    );
};

export default observer(Members);