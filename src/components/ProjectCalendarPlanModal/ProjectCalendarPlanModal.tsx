import {FC, useEffect, useState} from 'react';
import {IProjectCalendarPlanModal} from "./IProjectCalendarPlanModal";
import {Button, DatePicker, Form, Input, Modal, Select} from "antd";
import {ICalendarPlanForm} from "../../types/forms";
import {calendarPlanType} from "../../constants/calendarPlan";
import {indicatorApprovalDoc} from "../../constants/indicator";
import calendarPlanApi from "../../api/calendarPlan-api";
import {useStore} from "../../store";

const requiredFormItem = {
    required: true,
    message: ''
}

const ProjectCalendarPlanModal: FC<IProjectCalendarPlanModal> = ({open, onClose, initialValues, onSubmit, submitText, titleText, loading}) => {
    const [calendarPlanTypeList, setCalendarPlanTypeList] =
        useState<{value: string, label: string}[]>([]);
    const [approvalDocList, setApprovalDocList] =
        useState<{value: string, label: string}[]>([]);
    const [parentStageList, setParentStageList] =
        useState<{value: string | number, label: string}[]>([])
    const [pointType, setPointType] = useState<string>();

    const projectStore = useStore(store => store.project);

    useEffect(() => {
        setCalendarPlanTypeList(
            Object.entries(calendarPlanType).map(([key, value]) => ({
                value: key,
                label: value.text
            }))
        );
        setApprovalDocList(
            Object.entries(indicatorApprovalDoc).map(([key, value]) => ({
                value: key,
                label: value.text
            }))
        );

        if (initialValues) {
            setPointType(initialValues.type);
        }
    }, [initialValues]);

    useEffect(() => {
        const fetchStages = async () => {
            const res = await calendarPlanApi.getStages(projectStore.project.id)
            setParentStageList(res.data.map(item => ({value: item.id, label: item.name})))
        }

        if (pointType === 'WORK') {
            fetchStages().then()
        }
    }, [projectStore, pointType])

    const onCloseHandler = () => {
        if (onClose) onClose()
    };

    const onSubmitHandler = (values: ICalendarPlanForm) => {
        if (onSubmit) onSubmit(values)
    };

    return (
        <Modal
            destroyOnClose
            open={open}
            onCancel={onCloseHandler}
            bodyStyle={{paddingTop: 30}}
            title={titleText ? titleText : 'Новая точка'}
            width={800}
            style={{top: 20}}
            footer={null}
        >
            <Form labelCol={{span: 8}} wrapperCol={{span: 16}} labelAlign='left' onFinish={onSubmitHandler} initialValues={initialValues}>
                <Form.Item name='type' label='Тип точки' rules={[requiredFormItem]}>
                    <Select placeholder='Тип точки'
                            options={calendarPlanTypeList}
                            onChange={(value) => {if (value) {setPointType(value)}}}
                            disabled={!!initialValues}
                    />
                </Form.Item>
                {
                    pointType === 'WORK'
                    ?
                        <>
                            <Form.Item name='parent_stage_id' label='Этап' rules={[requiredFormItem]}>
                                <Select placeholder='Этап' options={parentStageList}/>
                            </Form.Item>
                            <Form.Item name='name' label='Наименование' rules={[requiredFormItem]}>
                                <Input placeholder='Наименование'/>
                            </Form.Item>
                            <Form.Item name='awaiting_result' label='Ожидаемые результат' rules={[requiredFormItem]}>
                                <Input placeholder='Ожидаемые результат'/>
                            </Form.Item>
                            <Form.Item name='start_date_plan' label='Планируемая дата начала' rules={[requiredFormItem]}>
                                <DatePicker  placeholder='Планируемая дата начала' style={{width: '100%'}} format='DD.MM.YYYY'/>
                            </Form.Item>
                            <Form.Item name='start_date_forecast' label='Прогнозируемая дата начала'>
                                <DatePicker  placeholder='Прогнозируемая дата начала' style={{width: '100%'}} format='DD.MM.YYYY'/>
                            </Form.Item>
                            <Form.Item name='start_date_fact' label='Фактическая дата начала'>
                                <DatePicker  placeholder='Фактическая дата начала' style={{width: '100%'}} format='DD.MM.YYYY'/>
                            </Form.Item>
                            <Form.Item name='end_date_plan' label='Планируемая дата конца' rules={[requiredFormItem]}>
                                <DatePicker  placeholder='Планируемая дата конца' style={{width: '100%'}} format='DD.MM.YYYY'/>
                            </Form.Item>
                            <Form.Item name='end_date_forecast' label='Прогнозируемая дата конца'>
                                <DatePicker  placeholder='Прогнозируемая дата конца' style={{width: '100%'}} format='DD.MM.YYYY'/>
                            </Form.Item>
                            <Form.Item name='end_date_fact' label='Фактическая дата конца'>
                                <DatePicker  placeholder='Фактическая дата конца' style={{width: '100%'}} format='DD.MM.YYYY'/>
                            </Form.Item>
                            <Form.Item name='approval_doc' label='Утверждающий документ' rules={[requiredFormItem]}>
                                <Select placeholder='Утверждающий документ' options={approvalDocList}/>
                            </Form.Item>
                        </>
                    :
                        pointType === 'CONTROL_POINT'
                            ?
                            <>
                                <Form.Item name='name' label='Наименование' rules={[requiredFormItem]}>
                                    <Input placeholder='Наименование '/>
                                </Form.Item>
                                <Form.Item name='end_date' label='Дата конца' rules={[requiredFormItem]}>
                                    <DatePicker  placeholder='Дата конца' style={{width: '100%'}} format='DD.MM.YYYY'/>
                                </Form.Item>
                                <Form.Item name='approval_doc' label='Утверждающий документ' rules={[requiredFormItem]}>
                                    <Select placeholder='Утверждающий документ' options={approvalDocList}/>
                                </Form.Item>
                            </>
                            :
                            <>
                                <Form.Item name='name' label='Наименование' rules={[requiredFormItem]}>
                                    <Input placeholder='Наименование '/>
                                </Form.Item>
                                <Form.Item name='awaiting_result' label='Ожидаемые результат' rules={[requiredFormItem]}>
                                    <Input placeholder='Ожидаемые результат'/>
                                </Form.Item>
                            </>
                }
                <Form.Item style={{display: 'flex', justifyContent: 'right'}}>
                    <Button htmlType='submit' type='primary' loading={loading}>{submitText ? submitText : 'Добавить'}</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProjectCalendarPlanModal;