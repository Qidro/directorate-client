import {FC, useEffect, useState} from 'react';
import {Form, Modal, Select, Spin} from "antd";
import {IMembersModalProps} from "./IMembersModalProps";
import {observer} from "mobx-react-lite";
import {IUser} from "../../types/user";
import UserApi from "../../api/user-api";
import {useForm} from "antd/es/form/Form";

const MembersModal: FC<IMembersModalProps> = ({open, onClose, initialValues, onSelect, onDeselect, loadingFields, roles}) => {
    const [users, setUsers] = useState<IUser[]>([])
    const [usersLoading, setUsersLoading] = useState<boolean>(false)
    const [form] = useForm()

    useEffect(() => {
        const fetchUsers = async () => {
            setUsersLoading(true)

            const res = await UserApi.getUsers()
            setUsers(res.data)

            setUsersLoading(false)
        }

        if (open) fetchUsers().then()
    }, [open])

    useEffect(() => {
        form.setFieldsValue(roles.reduce((obj, item) => {
            return Object.assign(obj, { [item.slug]: initialValues?.filter(user => user.role.slug === item.slug).map(user => user.id) })
        }, {}))
    }, [form, initialValues, roles])

    const onSelectHandler = (value: any, option: any) => {
        if (onSelect) onSelect(option.userId, option.roleId)
    }

    const onDeselectHandler = (value: any, option: any) => {
        if (onDeselect) onDeselect(option.userId, option.roleId)
    }

    return (
        <Modal
            open={open}
            footer={false} title='Редактирование участников'
            width={750}
            bodyStyle={{paddingTop: 30}}
            onCancel={onClose}
            forceRender
        >
            <Spin spinning={usersLoading}>
                <Form
                    labelCol={{span: 12}}
                    wrapperCol={{span: 12}}
                    labelAlign='left'
                    form={form}
                >
                    {roles.map(role => (
                        <Form.Item name={role.slug} key={role.id} label={role.name}>
                            <Select
                                mode='multiple'
                                onSelect={onSelectHandler}
                                onDeselect={onDeselectHandler}
                                showSearch={false}
                                disabled={loadingFields.includes(role.id)}
                                loading={loadingFields.includes(role.id)}
                                options={users.map(user => ({
                                    value: user.id,
                                    label: `${user.fullname} | ${user.position.name}`,
                                    userId: user.id,
                                    roleId: role.id
                                }))}
                            />
                        </Form.Item>
                    ))}
                </Form>
            </Spin>
        </Modal>
    );
};

export default observer(MembersModal);