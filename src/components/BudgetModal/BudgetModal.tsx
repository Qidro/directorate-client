import {FC, useEffect, useState} from 'react';
import {Button, Form, InputNumber, message, Modal, Select} from "antd";
import {IBudgetModalProps} from "./IBudgetModalProps";
import CalendarPlanApi from "../../api/calendarPlan-api";
import {useParams} from "react-router-dom";

const requiredFormItem = {
    required: true,
    message: ''
}

const costsName = [
    {label: 'Заработная плата', value: 'WAGE'},
    {label: 'Накладные расходы', value: 'OVERHEADS'},
    {label: 'Оборудование', value: 'EQUIPMENT'},
    {label: 'Программное обеспечение', value: 'SOFTWARE'},
    {label: 'Расходные материалы', value: 'CONSUMABLES'},
    {label: 'Командировки', value: 'BUSINESS_TRIPS'},
    {label: 'Обучение', value: 'EDUCATION'},
]

const fundingSource = [
    {label: 'Собственный средства УГМУ', value: 'OWN_FUNDS'},
    {label: 'Финансирование из "Приоритет 2030"', value: 'PRIORITY_FUNDING'},
    {label: 'Иное финансирование', value: 'OTHER_FUNDING'},
]

const BudgetModal: FC<IBudgetModalProps> = ({open, onClose, initialValues, onSubmit, submitText, titleText, loading})  => {
    const {projectId} = useParams();

    const [stages, setStages] = useState<{label: string, value: number}[]>()

    useEffect(() => {
        const fetchStages = async () => {
            try {
                const res = await CalendarPlanApi.getPlans(projectId!);
                setStages(res.data.filter(stage => stage.type === 'STAGE').map(stage => ({
                    label: stage.name, value: stage.id
                })));
            } catch (e) {
                message.error('Ошибка загрузки этапов проекта');
            }
        };

        fetchStages().then();
    }, [projectId, open])

    return (
        <Modal
            destroyOnClose
            open={open}
            onCancel={onClose}
            bodyStyle={{paddingTop: 30}}
            title={titleText}
            width={800}
            footer={null}
        >
            <Form labelCol={{span: 8}} wrapperCol={{span: 16}} labelAlign='left' onFinish={onSubmit} initialValues={initialValues}>
                <Form.Item name='stage_id' label='Этап проекта' rules={[requiredFormItem]}>
                    <Select options={stages} placeholder='Этап проекта'/>
                </Form.Item>
                <Form.Item name='costs_name' label='Статья бюджета' rules={[requiredFormItem]}>
                    <Select options={costsName} placeholder='Статья бюджета'/>
                </Form.Item>
                <Form.Item name='funding_source' label='Источник финансирования' rules={[requiredFormItem]}>
                    <Select options={fundingSource} placeholder='Источник финансирования'/>
                </Form.Item>
                <Form.Item name='spending_costs' label='Затраты' rules={[requiredFormItem]}>
                    <InputNumber placeholder='Затраты' step={0.01} style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item style={{display: 'flex', justifyContent: 'right'}}>
                    <Button htmlType='submit' type='primary' loading={loading}>{submitText}</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BudgetModal;