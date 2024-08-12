import {FC, useEffect, useState} from 'react';
import {IProjectModalProps} from "./IProjectModalProps";
import {Button, Form, Input, Modal, Select} from "antd";
import {IProjectForm} from "../../types/forms";
import {projectPriority} from "../../constants/project";

const {TextArea} = Input

const requiredFormItem = {
    required: true,
    message: ''
}

const ProjectModal: FC<IProjectModalProps> = ({open, onClose, initialValues, onSubmit, submitText, titleText, loading}) => {
    const [priorityList, setPriorityList] = useState<{value: string, label: string}[]>([])

    useEffect(() => {
        setPriorityList(
            Object.entries(projectPriority).map(([key, value]) => ({
                value: key,
                label: value.text
            }))
        )
    }, [])

    const onCloseHandler = () => {
        if (onClose) onClose()
    }

    const onSubmitHandler = (values: IProjectForm) => {
        if (onSubmit) onSubmit(values)
    }

    return (
        <Modal
            destroyOnClose
            open={open}
            onCancel={onCloseHandler}
            bodyStyle={{paddingTop: 30}}
            title={titleText ? titleText : 'Новый проект'}
            width={800}
            style={{top: 20}}
            footer={null}
        >
            <Form labelCol={{span: 8}} wrapperCol={{span: 16}} labelAlign='left' onFinish={onSubmitHandler} initialValues={initialValues}>
                <Form.Item name='name' label='Название проекта' rules={[requiredFormItem]}>
                    <Input placeholder='Название проекта'/>
                </Form.Item>
                <Form.Item name='short_name' label='Краткое название' rules={[requiredFormItem]}>
                    <Input placeholder='Краткое название проекта'/>
                </Form.Item>
                <Form.Item name='priority' label='Приоритет' rules={[requiredFormItem]}>
                    <Select placeholder='Приоритет проекта' options={priorityList}/>
                </Form.Item>
                <Form.Item name='type' label='Тип' rules={[requiredFormItem]}>
                    <Input placeholder='Тип проекта'/>
                </Form.Item>
                <Form.Item name='description' label='Описание' rules={[requiredFormItem]}>
                    <TextArea placeholder='Описание проекта'/>
                </Form.Item>
                <Form.Item name='formal_basis' label='Формальное основание' rules={[requiredFormItem]}>
                    <TextArea placeholder='Формальное основание для инициации'/>
                </Form.Item>
                <Form.Item name='project_justification' label='Обоснование проекта' rules={[requiredFormItem]}>
                    <TextArea placeholder='Обоснование проекта'/>
                </Form.Item>
                <Form.Item name='additional_info' label='Дополнительная информация' rules={[requiredFormItem]}>
                    <TextArea placeholder='Дополнительная информация'/>
                </Form.Item>
                <Form.Item name='project_goals' label='Цели проекта' rules={[requiredFormItem]}>
                    <TextArea placeholder='Цели проекта'/>
                </Form.Item>
                <Form.Item name='risks' label='Риски и возможности' rules={[requiredFormItem]}>
                    <TextArea placeholder='Риски и возможности'/>
                </Form.Item>
                <Form.Item name='deviations' label='Отклонения' rules={[requiredFormItem]}>
                    <TextArea placeholder='Отклонения'/>
                </Form.Item>
                <Form.Item style={{display: 'flex', justifyContent: 'right'}}>
                    <Button htmlType='submit' type='primary' loading={loading}>{submitText ? submitText : 'Создать'}</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProjectModal;