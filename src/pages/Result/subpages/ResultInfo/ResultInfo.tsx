import {Card, Descriptions, Spin, Typography} from "antd";
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom";
import { useStore } from "../../../../store";
import CardTitle from "../../../../components/CardTitle/CardTitle";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography;

const ResultInfo = () => {
    const resultStore = useStore(store => store.result)

    return (
        <Spin spinning={!checkStore([resultStore.result])}>
            <Card>
                <CardTitle>
                    <Title level={4}>Общая информация</Title>
                </CardTitle>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label='Наименование'>{resultStore.result.name}</Descriptions.Item>
                    <Descriptions.Item label='Объект управления'>
                        {resultStore.result.project ? <>
                        <Link to={`/project/${resultStore.result.project.id}/info`}>
                            №{resultStore.result.project.id} {resultStore.result.project.name}
                            </Link>
                        </> : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label='Тип результата'>{resultStore.result.type}</Descriptions.Item>
                    <Descriptions.Item label='Единица измерения'>{resultStore.result.units_measure}</Descriptions.Item>
                    <Descriptions.Item label='Характеристика результата'>{resultStore.result.characteristic}</Descriptions.Item>
                    <Descriptions.Item label='Утверждающий документ'>{resultStore.result.approval_doc}</Descriptions.Item>
                </Descriptions>
            </Card>
        </Spin>
    );
};

export default observer(ResultInfo);