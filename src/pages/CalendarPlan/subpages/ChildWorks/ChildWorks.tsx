import {Card, Descriptions, Empty, Skeleton, Space, Tag, Typography} from "antd";
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom";
import { useStore } from '../../../../store';
import {getCPStatus} from "../../../../utils/getCPStatus";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography

const ChildWorks = () => {
    const {
        calendarPlan: calendarPlanStore,
        project: projectStore
    } = useStore()

    return (
        <div>
            <Card>
                <Title level={4}>Работы к выполнению</Title>
                {
                    checkStore([calendarPlanStore.calendarPlan])
                        ?
                        calendarPlanStore.calendarPlan.children!.length > 0
                            ?
                                <Descriptions layout="vertical" column={1} >
                                    {
                                        calendarPlanStore.calendarPlan.children?.map((children, index) =>
                                            <Descriptions.Item key={index}>
                                                <Space direction='horizontal' align='start' size='large'>
                                                    <Link to={`/project/${projectStore.project.id}/calendar_plan/${children.id}/info`}>{children.name}</Link>
                                                    <Tag color={'#' + getCPStatus(children.status)[1]}>{getCPStatus(children.status)[0]}</Tag>
                                                </Space>
                                            </Descriptions.Item>
                                        )
                                    }
                                </Descriptions>
                            :
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        : <Skeleton active></Skeleton>
                }
            </Card>
        </div>
    );
};

export default observer(ChildWorks);