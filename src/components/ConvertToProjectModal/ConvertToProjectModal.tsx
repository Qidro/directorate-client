import {FC, useEffect, useState} from 'react';
import {Button, Form, message, Modal, Select} from "antd";
import {IConvertToProjectProps} from "./IConvertToProjectProps";
import backpackApi from "../../api/backpack-api";
import userApi from "../../api/user-api";

const requiredFormItem = {
    required: true,
    message: ''
}

interface IOptions {
    value: string | number;
    label: string;
}

const ConvertToProjectModal: FC<IConvertToProjectProps> = ({open, onClose, onSubmit, submitText, loading}) => {
    const [backpacks, setBackpacks] = useState<IOptions[]>();
    const [users, setUsers] = useState<IOptions[]>();

    useEffect(() => {
        backpackApi.getAllBackpacks().then((res) => {
            const data = res.data.map(backpack => {
                return {
                    value: backpack.id,
                    label: backpack.name
                }
            });
            setBackpacks(data);
        }).catch(() => {
            message.error('Ошибка загрузки списка портфелей!');
        });

        userApi.getUsers().then((res) => {
            const data = res.data.map(user => {
                return {
                    value: user.id,
                    label: `${user.fullname} - ${user.position.name}`
                }
            })
            setUsers(data);
        }).catch(() => {
            message.error('Ошибка загрузки списка пользователей!');
        });
    }, []);

    return (
        <Modal title="Параметры преобразования проектного предложения"
               destroyOnClose
               open={open}
               onCancel={onClose}
               footer={false}>
            <Form labelAlign='left' onFinish={onSubmit}>
                <Form.Item style={{marginTop: 26}} name='backpackId' rules={[requiredFormItem]}>
                    <Select
                        showSearch
                        placeholder="Выберите портфель"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={backpacks}
                        allowClear
                    />
                </Form.Item>
                <Form.Item style={{marginTop: 26}} name='userId' rules={[requiredFormItem]}>
                    <Select
                        showSearch
                        placeholder="Выберите руководителя"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={users}
                    />
                </Form.Item>
                <Form.Item style={{marginTop: 26}} name='userCuratorId' rules={[requiredFormItem]}>
                    <Select
                        showSearch
                        placeholder="Выберите руководителя от исполнительной дирекции"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={users}
                    />
                </Form.Item>
                <Form.Item style={{display: 'flex', justifyContent: 'right'}}>
                    <Button htmlType='submit' type='primary' loading={loading}>{submitText}</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ConvertToProjectModal;