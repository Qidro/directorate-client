import {useEffect, useState} from 'react';
import {Button, message, Popconfirm, Space, Spin, Typography} from "antd";
import ProjectApi from "../api/project-api";
import {getProjectStage} from "../utils/getProjectStage";
import {useStore} from "../store";

const {Title} = Typography;
const stages = ['INITIATION', 'PREPARATION', 'REALIZATION', 'COMPLETION', 'POST_PROJECT_MONITORING', 'ARCHIVED'];

const ProjectChangeStatus = () => {
    const projectStore = useStore(store => store.project)
    const [nextStage, setNextStage] = useState<string>('INITIATION');
    const [isChanging, setIsChanging] = useState<boolean>(false);

    useEffect(() => {
        setNextStage(stages[stages.indexOf(projectStore.project.status) + 1])
    }, [projectStore.project])

    const changeStatus = async (newStage: string, needDocument: boolean) => {
        setIsChanging(true);

        const type = await projectStore.getDocumentTypeByStage(newStage)
        const isDocument = await projectStore.checkDocument(type)

        if (isDocument || !needDocument || newStage === 'INITIATION') {
            try {
                const res = await ProjectApi.changeProjectStage(projectStore.project.id, newStage)
                message.success('Стадия изменена');
                projectStore.setProjectInformation(res.data);
            } catch (e) {
                message.error('Ошибка изменения стадии!');
            }
        } else if (type === 'PASSPORT') message.warning('Для перехода на стадию прикрепите паспорт проекта!')
        else if (type === 'PLAN') message.warning('Для перехода на стадию прикрепите сводный план проекта!')
        else if (type === 'WORK_PLAN') message.warning('Для перехода на стадию прикрепите рабочий план проекта!')
        else if (type === 'FINAL_REPORT') message.warning('Для перехода на стадию прикрепите итоговый отчет о реализации проекта!')

        setIsChanging(false);
    }

    return (
        <Spin spinning={isChanging}>
            <div style={{marginBottom: 20}}>
                <Title level={4}>Изменить стадию проекта</Title>
            </div>
            <Space>
                {
                    projectStore.project.status !== 'ARCHIVED'
                        ?
                        <Popconfirm
                            title="Изменение стадии проекта"
                            description="Вы уверены, что хотите изменить стадию проекта?"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => changeStatus(nextStage, true)}
                        >
                            <Button type="primary">{getProjectStage(nextStage)[0]}</Button>
                        </Popconfirm>
                        : <></>
                }
                {
                    projectStore.project.status !== 'CANCELED'
                        ?
                        <Popconfirm
                            title="Отмена проекта"
                            description="Вы уверены, что хотите отменить проект?"
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => changeStatus('CANCELED', false)}
                        >
                            <Button type="dashed">Отменить</Button>
                        </Popconfirm>
                        : <></>
                }
            </Space>
        </Spin>
    );
};

export default ProjectChangeStatus;