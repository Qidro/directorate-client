import {useEffect, useState} from 'react';
import {Button, Form, Input, message} from "antd";
import OrgStructureApi from "../../../api/orgStructure-api";
import {Department, NewPosition, Position} from "../../../types/orgStructure";
import {useForm} from "antd/es/form/Form";

type Props = {
    setEditPositionFormOpened: (setEditPositionFormOpened: boolean) => void;
    positionInfo?: Position;
    setDepartmentsInfo: (setDepartmentsInfo: Department[]) => void;
    departmentsInfo?: Department[];
}

const EditDepartmentForm = ({setEditPositionFormOpened, positionInfo}: Props) => {
    const [buttonLoading, setButtonLoading] = useState(false);
    const [form] = useForm();

    useEffect(() => {
        form.setFieldsValue(positionInfo)
    }, [form, positionInfo])

    const onFinish = ({name}:NewPosition) => {
        setButtonLoading(true)

        OrgStructureApi.editPosition(positionInfo ? positionInfo.id : 0, name).then(() => {
            setEditPositionFormOpened(false);
            message.success('Должность обновлена');
        }).catch(error => {
            if (error.response.data === 'Position not found') {
                message.error('Должность не найдена!')
            } else {
                message.error('Не удалось обновить данные должности!')
            }
        }).finally(() => {
            setButtonLoading(false)
        })
    };

    return (
        <Form
            labelCol={{ span: 13 }}
            labelAlign='left'
            layout="horizontal"
            style={{ maxWidth: "100vw", padding: '24px 0 0 0'}}
            name="department"
            onFinish={onFinish}
            initialValues={positionInfo}
            form={form}
        >
            <Form.Item label="Название должности" name='name' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item style={{textAlign: 'right'}}>
                <Button type="primary" htmlType="submit" loading={buttonLoading}>Обновить</Button>
            </Form.Item>
        </Form>
    );
};

export default EditDepartmentForm;