import {FC} from 'react';
import {IIndicatorValueModalProps} from "./IIndicatorValueModalProps";
import {Button, DatePicker, Form, InputNumber, Modal} from "antd";
import locale from 'antd/es/date-picker/locale/ru_RU'
import {useStore} from "../../store";
import {roleRequired} from "../../utils/roleRequired";
import {checkStore} from "../../utils/checkStore";

const requiredFormItem = {
    required: true,
    message: ''
}

const IndicatorValueModal: FC<IIndicatorValueModalProps> = ({open, onClose, onSubmit, initialValues, submitText, titleText, loading}) => {

    const {
        user: userStore,
        indicator: indicatorStore,
        project: projectStore
    } = useStore()

    const datePickerFormat = indicatorStore.indicator.evaluation_frequency === 'MONTH'
        ? 'month'
        : indicatorStore.indicator.evaluation_frequency === 'QUARTER'
            ? 'quarter'
            : 'year'

    const format = indicatorStore.indicator.evaluation_frequency === 'MONTH'
        ? 'MM.YYYY'
        : indicatorStore.indicator.evaluation_frequency === 'QUARTER'
            ? 'MM.YYYY'
            : 'YYYY'

    return (
        <Modal
            destroyOnClose
            open={open}
            onCancel={onClose}
            bodyStyle={{paddingTop: 30}}
            title={initialValues ? 'Редактировать' : 'Новое значение'}
            width={600}
            style={{top: 20}}
            footer={null}
        >
            {
                checkStore([indicatorStore.indicator, userStore.user, projectStore.project]) &&
                <Form labelCol={{span: 5}} wrapperCol={{span: 19}} labelAlign='left' onFinish={onSubmit}
                      initialValues={initialValues}>
                    <Form.Item name='period' label='Период' rules={[requiredFormItem]}>
                        <DatePicker picker={datePickerFormat} locale={locale} style={{width: '100%'}} format={format}
                                    disabled={!(roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users)
                                        || roleRequired(userStore.user.id, ['INPUT_RESPONSIBLE'], indicatorStore.indicator.users))}
                        />
                    </Form.Item>
                    <Form.Item name='plan_value' label='План' rules={[requiredFormItem]}>
                        <InputNumber style={{width: '100%'}} step="0.01" stringMode
                                     disabled={!(roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users)
                                         || roleRequired(userStore.user.id, ['INPUT_RESPONSIBLE'], indicatorStore.indicator.users))}
                                     placeholder='План'
                        />
                    </Form.Item>
                    <Form.Item name='forecast_value' label='Прогноз'>
                        <InputNumber style={{width: '100%'}} step="0.01" stringMode placeholder='Прогноз'/>
                    </Form.Item>
                    <Form.Item name='actual_value' label='Факт'>
                        <InputNumber style={{width: '100%'}} step="0.01" stringMode placeholder='Факт'/>
                    </Form.Item>
                    <Form.Item style={{display: 'flex', justifyContent: 'right'}}>
                        <Button htmlType='submit' type='primary'
                                loading={loading}>{initialValues ? 'Обновить' : 'Добавить'}</Button>
                    </Form.Item>
                </Form>
            }
        </Modal>
    );
};

export default IndicatorValueModal;