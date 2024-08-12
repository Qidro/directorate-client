import {FC} from 'react';
import {Button, Form, Input, InputNumber, Modal, Select} from "antd";
import {IContractModalProps} from "./IContractModalProps";

const requiredFormItem = {
    required: true,
    message: ''
}

const {TextArea} = Input;

const contractType = [
    {value: 'Закрытый аукцион'},
    {value: 'Открытый аукцион'},
    {value: 'Размещение заказа у единственного поставщика'},
    {value: 'Электронный аукцион'},
]

const ContractModal: FC<IContractModalProps> = ({open, onClose, initialValues, onSubmit, submitText, titleText, loading})  => {
    return (
        <Modal
            destroyOnClose
            open={open}
            onCancel={onClose}
            bodyStyle={{paddingTop: 30}}
            title={titleText ? titleText : 'Новый контракт'}
            width={800}
            footer={null}
        >
            <Form labelCol={{span: 8}} wrapperCol={{span: 16}} labelAlign='left' onFinish={onSubmit} initialValues={initialValues}>
                <Form.Item name='name' label='Наименование' rules={[requiredFormItem]}>
                    <Input placeholder='Предпологаемое наименование контракта'/>
                </Form.Item>
                <Form.Item name='type' label='Тип' rules={[requiredFormItem]}>
                    <Select options={contractType} placeholder='Тип контракта'/>
                </Form.Item>
                <Form.Item name='federalLaw' label='Федеральный закон' rules={[requiredFormItem]}>
                    <Input placeholder='Федеральный закон'/>
                </Form.Item>
                <Form.Item name='plannedCost' label='Планируемая стоимость' rules={[requiredFormItem]}>
                    <InputNumber placeholder='Планируемая стоимость' step={0.01} style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item name='cost' label='Стоимость'>
                    <InputNumber placeholder='Стоимость' step={0.01} style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item name='paid' label='Оплачено'>
                    <InputNumber placeholder='Оплачено' step={0.01} style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item name='description' label='Описание'>
                    <TextArea placeholder='Описание'/>
                </Form.Item>
                <Form.Item name='link' label='Ссылка на сайт проведения закупок'>
                    <Input placeholder='Ссылка на сайт проведения закупок'/>
                </Form.Item>
                <Form.Item style={{display: 'flex', justifyContent: 'right'}}>
                    <Button htmlType='submit' type='primary' loading={loading}>{submitText ? submitText : 'Добавить'}</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ContractModal;