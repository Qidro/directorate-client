import {useEffect, useState} from 'react';
import {Button, Form, Input, message} from "antd";
import OrgStructureApi from "../../../api/orgStructure-api";
import {Department, NewDepartment} from "../../../types/orgStructure";
import {useForm} from "antd/es/form/Form";

type Props = {
    setEditDepartmentFormOpened: (setNewDepartmentFormOpened: boolean) => void;
    departmentInfo?: Department;
    setDepartmentsInfo: (setDepartmentsInfo: Department[]) => void;
    departmentsInfo?: Department[];
}

const EditDepartmentForm = ({setEditDepartmentFormOpened, departmentInfo, setDepartmentsInfo, departmentsInfo}: Props) => {
    const [buttonLoading, setButtonLoading] = useState(false);
    const [form] = useForm();

    useEffect(() => {
        form.setFieldsValue(departmentInfo)
    }, [form, departmentInfo])

    const onFinish = ({name}:NewDepartment) => {
        setButtonLoading(true)

        OrgStructureApi.editDepartment(departmentInfo ? departmentInfo.id : 0, name).then((res) => {
            setEditDepartmentFormOpened(false);
            message.success('Отдел обновлен');
        }).catch(error => {
            if (error.response.data === 'Department not found') {
                message.error('Отдел не найден!')
            } else {
                message.error('Не удалось обновить данные отдела!')
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
            initialValues={departmentInfo}
            form={form}
        >
            <Form.Item label="Название отдела" name='name' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item style={{textAlign: 'right'}}>
                <Button type="primary" htmlType="submit" loading={buttonLoading}>Обновить</Button>
            </Form.Item>
        </Form>
    );
};

export default EditDepartmentForm;