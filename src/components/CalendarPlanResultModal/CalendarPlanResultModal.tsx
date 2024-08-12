import {FC, useEffect, useState} from 'react';
import {Form, message, Modal, Select, Spin} from "antd";
import {ICalendarPlanResultModalProps} from "./ICalendarPlanResultModalProps";
import {observer} from "mobx-react-lite";
import {useForm} from "antd/es/form/Form";
import {getResultStatus} from "../../utils/getResultStatus";
import {IResult} from "../../types/result";
import ResultApi from "../../api/result-api";
import {useParams} from "react-router-dom";
import {useStore} from "../../store";

const CalendarPlanResultModal: FC<ICalendarPlanResultModalProps> = ({open, onClose, initialValues, onSelect, onDeselect, loadingField}) => {
    const [projectResults, setProjectResults] = useState<IResult[]>([]);
    const [resultsLoading, setResultsLoading] = useState<boolean>(false);
    const [form] = useForm();
    const {projectId} = useParams();

    const calendarPlanStore = useStore(store => store.calendarPlan)

    useEffect(() => {
        setResultsLoading(true);
        const fetchResults = async () => {
            try {
                const res = await ResultApi.getByProject(projectId!);
                setProjectResults(res.data);
            } catch (e) {
                message.destroy();
                message.error('Ошибка загурзки списка результатов!');
            }
            setResultsLoading(false);
        }

        if (open) fetchResults().then();

    }, [projectId, open])

    useEffect(() => {
        form.setFieldsValue({ 'results': initialValues?.map(result => result.result.id)})
    }, [form, initialValues])

    const onSelectHandler = (value: any, option: any) => {
        if (onSelect) onSelect(calendarPlanStore.calendarPlan.id, value)
    }

    const onDeselectHandler = (value: any, option: any) => {
        if (onDeselect) onDeselect(calendarPlanStore.calendarPlan.id, value)
    }

    return (
        <Modal
            open={open}
            footer={false} title='Редактирование результатов'
            width={750}
            bodyStyle={{paddingTop: 30}}
            onCancel={onClose}
            forceRender
        >
            <Spin spinning={resultsLoading}>
                <Form
                    labelCol={{span: 12}}
                    wrapperCol={{span: 12}}
                    labelAlign='left'
                    form={form}
                >
                    <Form.Item name='results' label='Результаты'>
                        <Select
                            mode='multiple'
                            onSelect={onSelectHandler}
                            onDeselect={onDeselectHandler}
                            showSearch={false}
                            disabled={loadingField}
                            loading={loadingField}
                            options={projectResults.map(result => ({
                                value: result.id,
                                label: `${result.name} | ${getResultStatus(result.status)[0]}`,
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default observer(CalendarPlanResultModal);