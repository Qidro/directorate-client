import {Card, Descriptions, Spin, Typography} from "antd";
import {observer} from "mobx-react-lite";
import dayjs from "dayjs";
import {getEvaluationType} from "../../../../utils/getEvaluationType";
import {getEvaluationFrequency} from "../../../../utils/getEvaluationFrequency";
import {getInfoCollectionMethod} from "../../../../utils/getInfoCollectionMethod";
import {getCoverageUnits} from "../../../../utils/getCoverageUnits";
import {getApprovalDoc} from "../../../../utils/getApprovalDoc";
import {useStore} from "../../../../store";
import CardTitle from "../../../../components/CardTitle/CardTitle";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography;

const IndicatorInfo = () => {
    const indicatorStore = useStore(store => store.indicator)

    return (
        <Spin spinning={!checkStore([indicatorStore.indicator])}>
            <Card>
                <CardTitle>
                    <Title level={4}>Общая информация</Title>
                </CardTitle>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label='Наименование'>{indicatorStore.indicator.name}</Descriptions.Item>
                    <Descriptions.Item label='Тип оценки показателя'>{getEvaluationType(indicatorStore.indicator.evaluation_type)}</Descriptions.Item>
                    <Descriptions.Item label='Периодичность оценки показателя'>{getEvaluationFrequency(indicatorStore.indicator.evaluation_frequency)}</Descriptions.Item>
                    <Descriptions.Item label='Единица измерения'>{indicatorStore.indicator.units_measure}</Descriptions.Item>
                    <Descriptions.Item label='Базовое значение'>{indicatorStore.indicator.base_value}</Descriptions.Item>
                    <Descriptions.Item label='Дата расчёта базового значения'>{
                        dayjs(indicatorStore.indicator.base_value_date).isValid()
                            ? dayjs(indicatorStore.indicator.base_value_date).format('DD.MM.YYYY')
                            : ''
                    }</Descriptions.Item>
                    <Descriptions.Item label='Описание'>{indicatorStore.indicator.description}</Descriptions.Item>
                    <Descriptions.Item label='Метод сбора информации, индекс формы отчетности'>{getInfoCollectionMethod(indicatorStore.indicator.info_collection)}</Descriptions.Item>
                    <Descriptions.Item label='Охват единиц совокупности'>{getCoverageUnits(indicatorStore.indicator.coverage_units)}</Descriptions.Item>
                    <Descriptions.Item label='Утверждающий документ'>{getApprovalDoc(indicatorStore.indicator.approval_doc)}</Descriptions.Item>
                </Descriptions>
            </Card>
        </Spin>
    );
};

export default observer(IndicatorInfo);