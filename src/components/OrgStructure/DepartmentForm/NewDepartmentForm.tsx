import {useState} from 'react';
import {Button, Form, Input, message} from "antd";
import OrgStructureApi from "../../../api/orgStructure-api";
import {Department, NewDepartment} from "../../../types/orgStructure";

type Props = {
    setNewDepartmentFormOpened: (setNewDepartmentFormOpened: boolean) => void;
    departmentsInfo?: Department[];
    setDepartmentsInfo: (setDepartmentsInfo: Department[]) => void;
}

const NewDepartmentForm = ({setNewDepartmentFormOpened, setDepartmentsInfo, departmentsInfo}: Props) => {
    const [buttonLoading, setButtonLoading] = useState(false);

    const onFinish = ({name}:NewDepartment) => {
        setButtonLoading(true)

        OrgStructureApi.createDepartment(name).then((res) => {
            setDepartmentsInfo(departmentsInfo ? [...departmentsInfo, res.data] : [res.data]);
            setNewDepartmentFormOpened(false);
            message.success('Отдел добавлен');
        }).catch(error => {
            if (error.response.data === 'Department already exist') {
                message.warning('Отдел уже существует!')
            } else {
                message.error('Ошибка добавления отдела!')
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
        >
            <Form.Item label="Название отдела" name='name' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item style={{textAlign: 'right'}}>
                <Button type="primary" htmlType="submit" loading={buttonLoading}>Добавить</Button>
            </Form.Item>
        </Form>
    );
};

export default NewDepartmentForm;