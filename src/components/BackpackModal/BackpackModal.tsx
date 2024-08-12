import {FC} from 'react';
import {IBackpacklModalProps} from "./IBackpacklModalProps";
import {Button, Form, Input, Modal} from "antd";
import {IBackpackForm} from "../../types/forms";

const {TextArea} = Input

const requiredFormItem = {
    required: true,
    message: ''
}

const ProposalModal: FC<IBackpacklModalProps> = ({open, onClose, initialValues, onSubmit, loading}) => {
    const onCloseHandler = () => {
        if (onClose) onClose()
    }

    const onSubmitHandler = (values: IBackpackForm) => {
        if (onSubmit) onSubmit(values)
    }

    return (
        <Modal
            destroyOnClose
            open={open}
            onCancel={onCloseHandler}
            bodyStyle={{paddingTop: 30}}
            title={initialValues ? initialValues.name : 'Новый портфель'}
            width={800}
            style={{top: 20}}
            footer={null}
        >
            <Form labelCol={{span: 8}} wrapperCol={{span: 16}} labelAlign='left' onFinish={onSubmitHandler} initialValues={initialValues}>
                <Form.Item name='name' label='Наименование портфеля' rules={[requiredFormItem]}>
                    <Input placeholder='Наименование портфеля'/>
                </Form.Item>
                <Form.Item name='description' label='Описание' rules={[requiredFormItem]}>
                    <TextArea placeholder='Описание портфеля'/>
                </Form.Item>
                <Form.Item style={{display: 'flex', justifyContent: 'right'}}>
                    <Button htmlType='submit' type='primary' loading={loading}>{initialValues ? 'Сохранить' : 'Создать'}</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProposalModal;