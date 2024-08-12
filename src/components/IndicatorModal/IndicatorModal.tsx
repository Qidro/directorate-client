import {FC} from 'react';
import {Button, DatePicker, Form, Input, InputNumber, Modal, Select} from "antd";
import {IIndicatorModalProps} from "./IIndicatorModalProps";
import {
    approvalDocOptions,
    coverageUnitsOptions,
    evaluationFrequencyOptions,
    evaluationTypeOptions,
    infoCollectionOptions
} from "./options";

const {TextArea} = Input;

const requiredFormItem = {
    required: true,
    message: ''
}

const IndicatorModal: FC<IIndicatorModalProps> = ({open, onClose, onSubmit, initialValues,
                                                      submitText, titleText, loading}
    ) => {
    return (
        <Modal
            destroyOnClose
            open={open}
            onCancel={onClose}
            bodyStyle={{paddingTop: 30}}
            title={titleText ? titleText : 'Новый показатель'}
            width={800}
            style={{top: 20}}
            footer={null}
        >
            <Form labelCol={{span: 8}} wrapperCol={{span: 16}} labelAlign='left' onFinish={onSubmit} initialValues={initialValues}>
                <Form.Item name='name' label='Наименование' rules={[requiredFormItem]}>
                    <Input placeholder='Наименование'/>
                </Form.Item>
                <Form.Item name='evaluation_type' label='Тип оценки показателя' rules={[requiredFormItem]}>
                    <Select
                        options={evaluationTypeOptions}
                        placeholder='Тип оценки показателя'
                    />
                </Form.Item>
                <Form.Item name='evaluation_frequency' label='Периодичность оценки показателя' rules={[requiredFormItem]}>
                    <Select
                        options={evaluationFrequencyOptions}
                        placeholder='Периодичность оценки показателя'
                    />
                </Form.Item>
                <Form.Item name='units_measure' label='Единица измерения'>
                    <Input placeholder='Единица измерения'/>
                </Form.Item>
                <Form.Item name='base_value' label='Базовое значение' rules={[requiredFormItem]}>
                    <InputNumber<string>
                        style={{width: '100%'}}
                        step="0.01"
                        stringMode
                        placeholder='Базовое значение'
                    />
                </Form.Item>
                <Form.Item name='base_value_date' label='Дата расчёта базового значения'>
                    <DatePicker style={{width: '100%'}} format='DD.MM.YYYY' placeholder='Дата расчёта базового значения'/>
                </Form.Item>
                <Form.Item name='description' label='Описание' rules={[requiredFormItem]}>
                    <TextArea placeholder='Описание'/>
                </Form.Item>
                <Form.Item name='info_collection' label='Метод сбора информации'>
                    <Select
                        options={infoCollectionOptions}
                        placeholder='Метод сбора информации'
                    />
                </Form.Item>
                <Form.Item name='coverage_units' label='Охват единиц совокупности'>
                    <Select
                        options={coverageUnitsOptions}
                        placeholder='Охват единиц совокупности'
                    />
                </Form.Item>
                <Form.Item name='approval_doc' label='Утверждающий документ' rules={[requiredFormItem]}>
                    <Select
                        options={approvalDocOptions}
                        placeholder='Утверждающий документ'
                    />
                </Form.Item>
                <Form.Item style={{display: 'flex', justifyContent: 'right'}}>
                    <Button htmlType='submit' type='primary' loading={loading}>{submitText ? submitText : 'Добавить'}</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default IndicatorModal;