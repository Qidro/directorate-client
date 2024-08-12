import {Card, Col, Descriptions, Row, Spin, Typography} from 'antd';
import { observer } from 'mobx-react-lite';
import {getProjectPriority} from "../../../../utils/getProjectPriority";
import dayjs from "dayjs";
import ProjectChangeStatus from "../../../../components/ProjectChangeStatus";
import style from './ProjectInfo.module.scss'
import {Link} from "react-router-dom";
import { useStore } from '../../../../store';
import {roleRequired} from "../../../../utils/roleRequired";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography

const ProjectInfo = () => {
    const {
        user: userStore,
        project: projectStore,
    } = useStore();

    return (
        <Spin spinning={!checkStore([projectStore.project])}>
            <Row gutter={[20, 20]}>
                {
                    checkStore([projectStore.project, userStore.user]) &&
                    roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN'], projectStore.project.users) &&
                    <Col xs={24}>
                        <Card>
                            <ProjectChangeStatus/>
                        </Card>
                    </Col>
                }
                <Col xs={24}>
                    <Card>
                        <div className={style.title}>
                            <Title level={4}>Общая информация</Title>
                        </div>
                        <Descriptions column={1} bordered className={style.description}>
                            <Descriptions.Item label='Наименование'>{projectStore.project.name}</Descriptions.Item>
                            <Descriptions.Item label='Краткое наименование'>{projectStore.project.short_name}</Descriptions.Item>
                            <Descriptions.Item label='Приоритет'>{getProjectPriority(projectStore.project.priority)}</Descriptions.Item>
                            <Descriptions.Item label='Тип проекта'>{projectStore.project.type}</Descriptions.Item>
                            <Descriptions.Item label='Дата начала'>{
                                dayjs(projectStore.project.start_date).isValid()
                                    ? dayjs(projectStore.project.start_date).format('DD.MM.YYYY')
                                    : ''
                            }</Descriptions.Item>
                            <Descriptions.Item label='Дата окончания'>{
                                dayjs(projectStore.project.end_date).isValid()
                                    ? dayjs(projectStore.project.end_date).format('DD.MM.YYYY')
                                    : ''
                            }</Descriptions.Item>
                            <Descriptions.Item label='Портфель'>
                                <Link to={`/backpack/${projectStore.project.backpack?.id}/info`}>№{projectStore.project.backpack?.id} {projectStore.project.backpack?.name}</Link>
                            </Descriptions.Item>
                            <Descriptions.Item label='Описание'>{projectStore.project.description}</Descriptions.Item>
                            <Descriptions.Item label='Формальное основание для инициации'>{projectStore.project.formal_basis}</Descriptions.Item>
                            <Descriptions.Item label='Обоснование проекта'>{projectStore.project.project_justification}</Descriptions.Item>
                            <Descriptions.Item label='Дополнительная информация'>{projectStore.project.additional_info}</Descriptions.Item>
                            <Descriptions.Item label='Цели проекта'>{projectStore.project.project_goals}</Descriptions.Item>
                            <Descriptions.Item label='Критерии успешности и допустимые отклонения'>{projectStore.project.deviations}</Descriptions.Item>
                            <Descriptions.Item label='Риски и возможности'>{projectStore.project.risks}</Descriptions.Item>
                            <Descriptions.Item label='Дата создания'>{
                                dayjs(projectStore.project.creation_date).isValid()
                                    ? dayjs(projectStore.project.creation_date).format('DD.MM.YYYY')
                                    : ''
                            }</Descriptions.Item>
                            <Descriptions.Item label='Дата изменения'>
                                {
                                    dayjs(projectStore.project.last_change_date).isValid()
                                        ? dayjs(projectStore.project.last_change_date).format('DD.MM.YYYY')
                                        : ''
                                }</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>
        </Spin>
    );
};

export default observer(ProjectInfo);