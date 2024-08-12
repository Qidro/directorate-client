import {useEffect, useState} from 'react';
import {Button, Form, Input, message, Select} from "antd";
import OrgStructureApi from "../../../api/orgStructure-api";
import {NewPosition} from "../../../types/orgStructure";

type Props = {
    setNewPositionFormOpened: (setNewPositionFormOpened: boolean) => void
}

interface Options {
    value: number,
    label: string
}

const NewPositionForm = ({setNewPositionFormOpened}: Props) => {
    const [options, setOptions] = useState<Options[]>([]);
    const [buttonLoading, setButtonLoading] = useState(false);

    const onFinish = ({name, department_id}:NewPosition) => {
        setButtonLoading(true)

        OrgStructureApi.createPosition(name, department_id).then((res) => {
            setNewPositionFormOpened(false);
            message.success('Должность добавлена в отдел');
        }).catch(error => {
            if (error.response.data === 'Department not found') {
                message.error('Отдел не найден!')
            } else if (error.response.data === 'Position already exist') {
                message.warning('Должность уже существует')
            } else {
                message.error('Ошибка добавления должности!')
            }
        }).finally(() => {
            setButtonLoading(false)
        })
    };

    const getOptionsData = async () => {
        const res = await OrgStructureApi.getDepartments();

        const data: Options[] = res.data.map((department) => {
            return {
                value: department.id,
                label: department.name,
            };
        });

        setOptions(data);
    }

    useEffect(() => {
        getOptionsData().then();
    }, [])

    return (
        <Form
            labelCol={{ span: 13 }}
            labelAlign='left'
            layout="horizontal"
            style={{ maxWidth: "100vw", padding: '24px 0 0 0'}}
            name="department"
            onFinish={onFinish}
        >

            <Form.Item label="Название должности" name='name' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Отдел" name='department_id' rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="Выберите отдел"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={options}
                />
            </Form.Item>
            <Form.Item style={{textAlign: 'right'}}>
                <Button type="primary" htmlType="submit" loading={buttonLoading}>Добавить</Button>
            </Form.Item>
        </Form>
    );
};

export default NewPositionForm;