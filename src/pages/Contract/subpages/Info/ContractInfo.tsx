import {Card, Col, Descriptions, Row, Spin, Typography} from "antd";
import {Link} from "react-router-dom";
import {observer} from "mobx-react-lite";
import ContractChangeStage from "../../../../components/ContractChangeStage";
import CardTitle from "../../../../components/CardTitle/CardTitle";
import { useStore } from "../../../../store";
import {checkStore} from "../../../../utils/checkStore";
import {roleRequired} from "../../../../utils/roleRequired";

const {Title} = Typography;

const ContractInfo = () => {
    const {
        user: userStore,
        project: projectStore,
        contract: contractStore
    } = useStore()

    return (
        <Spin spinning={!checkStore([contractStore.contract])}>
            <Row gutter={[20, 20]}>
                {
                    checkStore([contractStore.contract, projectStore.project, userStore.user]) &&
                    projectStore.editable &&
                    (
                        roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) ||
                        roleRequired(userStore.user.id, ['RESPONSIBLE'], contractStore.contract.users)
                    ) &&
                    <Col xs={24}>
                        <Card>
                            <ContractChangeStage/>
                        </Card>
                    </Col>
                }
                <Col xs={24}>
                    <Card>
                        <CardTitle>
                            <Title level={4}>Общая информация</Title>
                        </CardTitle>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label='Наименование'>{contractStore.contract.name}</Descriptions.Item>
                            <Descriptions.Item label='Тип'>{contractStore.contract.type}</Descriptions.Item>
                            <Descriptions.Item label='Федеральный закон'>{contractStore.contract.federal_law}</Descriptions.Item>
                            <Descriptions.Item label='Планируемая стоимость'>{contractStore.contract.planned_cost}</Descriptions.Item>
                            <Descriptions.Item label='Стоимость'>{contractStore.contract.cost}</Descriptions.Item>
                            <Descriptions.Item label='Оплачено'>{contractStore.contract.paid}</Descriptions.Item>
                            <Descriptions.Item label='Описание'>{contractStore.contract.description}</Descriptions.Item>
                            <Descriptions.Item label='Ссылка на сайт проведения закупок'>
                                <Link to={contractStore.contract.link}>{contractStore.contract.link}</Link>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>
        </Spin>
    );
};

export default observer(ContractInfo);