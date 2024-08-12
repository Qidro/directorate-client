import {FC} from 'react';
import {IResultModalProps} from "./IResultModalProps";
import {Button, Form, Input, Modal, Select} from "antd";
import {IResultForm} from "../../types/forms";

const requiredFormItem = {
    required: true,
    message: ''
}

const documents = [
    {value: 'Без утверждающего документа'},
    {value: 'Проектное предложение'},
    {value: 'Паспорт проекта'},
    {value: 'Рабочий план'},
    {value: 'Сводный план'}
]

const ResultModal: FC<IResultModalProps> = ({open, onClose, initialValues, onSubmit, submitText, titleText, loading}) => {
    const onCloseHandler = () => {
        if (onClose) onClose()
    }

    const onSubmitHandler = (values: IResultForm) => {
        if (onSubmit) onSubmit(values)
    }

    return (
        <Modal
            destroyOnClose
            open={open}
            onCancel={onCloseHandler}
            bodyStyle={{paddingTop: 30}}
            title={titleText ? titleText : 'Новый результат'}
            width={800}
            footer={null}
        >
            <Form labelCol={{span: 8}} wrapperCol={{span: 16}} labelAlign='left' onFinish={onSubmitHandler} initialValues={initialValues}>
                <Form.Item name='name' label='Наименование' rules={[requiredFormItem]}>
                    <Input placeholder='Предпологаемое наименование результата'/>
                </Form.Item>
                <Form.Item name='type' label='Тип' rules={[requiredFormItem]}>
                    <Input placeholder='Тип результата'/>
                </Form.Item>
                <Form.Item name='unitsMeasure' label='Единица измерения' rules={[requiredFormItem]}>
                    <Input placeholder='Единица измерения результата'/>
                </Form.Item>
                <Form.Item name='characteristic' label='Характеристика' rules={[requiredFormItem]}>
                    <Input.TextArea placeholder='Характеристика результата'/>
                </Form.Item>
                <Form.Item name='approvalDoc' label='Утверждающий документ' rules={[requiredFormItem]}>
                    <Select options={documents} placeholder='Утверждающий документ'/>
                </Form.Item>
                <Form.Item style={{display: 'flex', justifyContent: 'right'}}>
                    <Button htmlType='submit' type='primary' loading={loading}>{submitText ? submitText : 'Добавить'}</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ResultModal;