import {FC} from 'react';
import {Button, DatePicker, Form, InputNumber, Modal} from "antd";
import {IResultValueModalProps} from "./IResultValueModalProps";

const requiredFormItem = {
    required: true,
    message: ''
}

const ResultValueModal: FC<IResultValueModalProps> = ({open, onClose, initialValues, onSubmit, submitText, titleText, loading}) => {
    const onCloseHandler = () => {
        if (onClose) onClose()
    }

    const onSubmitHandler = (values: any) => {
        if (onSubmit) onSubmit(values)
    }

    return (
        <Modal
            destroyOnClose
            open={open}
            onCancel={onCloseHandler}
            bodyStyle={{paddingTop: 30}}
            title={titleText ? titleText : 'Новое значение результата'}
            width={800}
            footer={null}
        >
            <Form labelCol={{span: 8}} wrapperCol={{span: 16}} labelAlign='left' onFinish={onSubmitHandler} initialValues={initialValues}>
                <Form.Item name='achievementDate' label='Дата достижения' rules={[requiredFormItem]}>
                    <DatePicker style={{width: '100%'}} format='DD.MM.YYYY'/>
                </Form.Item>
                <Form.Item name='planValue' label='Плановое значение' rules={[requiredFormItem]}>
                    <InputNumber style={{width: '100%'}} placeholder='Плановое значение'/>
                </Form.Item>
                <Form.Item name='forecastValue' label='Прогноз' rules={[requiredFormItem]}>
                    <InputNumber style={{width: '100%'}} placeholder='Прогноз'/>
                </Form.Item>
                <Form.Item style={{display: 'flex', justifyContent: 'right'}}>
                    <Button htmlType='submit' type='primary' loading={loading}>{submitText ? submitText : 'Добавить'}</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ResultValueModal;