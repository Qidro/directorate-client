import {FC} from 'react';
import {IProposalModalProps} from "./IProposalModalProps";
import {Button, DatePicker, Form, Input, Modal} from "antd";
import {IProposalForm} from "../../types/forms";

const {TextArea} = Input
const {RangePicker} = DatePicker

const requiredFormItem = {
    required: true,
    message: ''
}

const ProposalModal: FC<IProposalModalProps> = ({open, onClose, initialValues, onSubmit, submitText, titleText, loading}) => {
    const onCloseHandler = () => {
        if (onClose) onClose()
    }

    const onSubmitHandler = (values: IProposalForm) => {
        if (onSubmit) onSubmit(values)
    }

    return (
        <Modal
            destroyOnClose
            open={open}
            onCancel={onCloseHandler}
            bodyStyle={{paddingTop: 30}}
            title={titleText ? titleText : 'Новое проектное предложение'}
            width={800}
            style={{top: 20}}
            footer={null}
        >
            <Form labelCol={{span: 8}} wrapperCol={{span: 16}} labelAlign='left' onFinish={onSubmitHandler} initialValues={initialValues}>
                <Form.Item name='name' label='Название проекта' rules={[requiredFormItem]}>
                    <Input placeholder='Предпологаемое название проекта'/>
                </Form.Item>
                <Form.Item name='realization_period' label='Период реализации' rules={[requiredFormItem]}>
                    <RangePicker style={{width: '100%'}} format='DD.MM.YYYY'/>
                </Form.Item>
                <Form.Item name='executors' label='Исполнители' rules={[requiredFormItem]}>
                    <TextArea placeholder='Предпологаемый руководитель (ФИО), команда проекта, другие организации'/>
                </Form.Item>
                <Form.Item name='justification' label='Обоснование проекта' rules={[requiredFormItem]}>
                    <TextArea placeholder='Указываются причины и обстоятельства, объясняющие необходимость реализации проекта'/>
                </Form.Item>
                <Form.Item name='purpose' label='Цель проекта' rules={[requiredFormItem]}>
                    <TextArea placeholder='Необходимо сформулировать ключевую цель, отражающую значимый научно-практический, социальный, экономический эффект от реализации проекта'/>
                </Form.Item>
                <Form.Item name='results' label='Результаты проекта' rules={[requiredFormItem]}>
                    <TextArea placeholder='Указывается ожидаемый результат от реализации проекта'/>
                </Form.Item>
                <Form.Item name='target_indicators' label='Целевые показатели проекта' rules={[requiredFormItem]}>
                    <TextArea placeholder='Необходимо перечислить от двух до пяти измеримых показателей, которые однозначно покажут на достижение цели проекта'/>
                </Form.Item>
                <Form.Item name='planned_actions' label='Описание планируемых действий' rules={[requiredFormItem]}>
                    <TextArea placeholder='Общее описание планируемых работ, а также влияние намеченных действий на основную проблему проекта.'/>
                </Form.Item>
                <Form.Item name='resources' label='Оценочные ресурсы проекта' rules={[requiredFormItem]}>
                    <TextArea placeholder='Необходимо провести первоначальную оценку трудозатрат, рассчитать примерный бюджет реализации проекта'/>
                </Form.Item>
                <Form.Item name='contacts' label='Контакты' rules={[requiredFormItem]}>
                    <TextArea placeholder='Указывается ФИО, должность, адрес электронной почты, контактный телефон инициатора/лица ответственного за подготовку проектного предложения'/>
                </Form.Item>
                <Form.Item style={{display: 'flex', justifyContent: 'right'}}>
                    <Button htmlType='submit' type='primary' loading={loading}>{submitText ? submitText : 'Подать'}</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProposalModal;