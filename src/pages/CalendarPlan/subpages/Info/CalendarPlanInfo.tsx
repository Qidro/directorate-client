import {Card, Descriptions, Spin, Typography} from "antd";
import {observer} from "mobx-react-lite";
import CardTitle from "../../../../components/CardTitle/CardTitle";
import {getApprovalDoc} from "../../../../utils/getApprovalDoc";
import dayjs from "dayjs";
import {useStore} from "../../../../store";
import {getCalendarPlanType} from "../../../../utils/getCalendarPlanType";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography;

const getDate = (date: Date) => {
    if (dayjs(date).isValid()) return dayjs(date).format('DD.MM.YYYY')
    else return null
}

const CalendarPlanInfo = () => {
    const calendarPlanStore = useStore(store => store.calendarPlan)

    return (
        <Spin spinning={!checkStore([calendarPlanStore.calendarPlan])}>
            <Card>
                <CardTitle>
                    <Title level={4}>Общая информация</Title>
                </CardTitle>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label='Наименование'>{calendarPlanStore.calendarPlan.name}</Descriptions.Item>
                    <Descriptions.Item label='Тип'>{getCalendarPlanType(calendarPlanStore.calendarPlan.type)}</Descriptions.Item>
                    {
                        ['WORK', 'STAGE'].includes(calendarPlanStore.calendarPlan.type)
                            ? <>

                                <Descriptions.Item label='Планируемая дата начала'>{getDate(calendarPlanStore.calendarPlan.start_date_plan)}</Descriptions.Item>
                                <Descriptions.Item label='Прогнозируемая дата начала'>{getDate(calendarPlanStore.calendarPlan.start_date_forecast)}</Descriptions.Item>
                                <Descriptions.Item label='Фактическая дата начала'>{getDate(calendarPlanStore.calendarPlan.start_date_fact)}</Descriptions.Item>
                                <Descriptions.Item label='Количество дней'>{calendarPlanStore.calendarPlan.length_of_days}</Descriptions.Item>
                                <Descriptions.Item label='Количество рабочих дней'>{calendarPlanStore.calendarPlan.working_days}</Descriptions.Item>
                                <Descriptions.Item label='Планируемая дата конца'>{getDate(calendarPlanStore.calendarPlan.end_date_plan)}</Descriptions.Item>
                                <Descriptions.Item label='Прогнозируемая дата конца'>{getDate(calendarPlanStore.calendarPlan.end_date_forecast)}</Descriptions.Item>
                                <Descriptions.Item label='Фактическая дата конца'>{getDate(calendarPlanStore.calendarPlan.end_date_fact)}</Descriptions.Item>
                            </> :
                                <Descriptions.Item label='Дата конца'>{dayjs(calendarPlanStore.calendarPlan.end_date_plan).format('DD.MM.YYYY')}</Descriptions.Item>
                    }
                    <Descriptions.Item label='Утверждающий документ'>{getApprovalDoc(calendarPlanStore.calendarPlan.approval_doc)}</Descriptions.Item>
                </Descriptions>
            </Card>
        </Spin>
    );
};

export default observer(CalendarPlanInfo);