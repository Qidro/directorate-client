import {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Card, Col, message, Row, Spin, Table, Typography} from "antd";
import {ICalendarPlan, ICalendarPlanCP} from "../../../../types/calendarPlan";
import CalendarPlanApi from "../../../../api/calendarPlan-api";
import ProjectBaseCP from "../../../../components/ProjectBaseCP/ProjectBaseCP";
import {useParams} from "react-router-dom";
import {getColumns, ITableDataType} from "./tableData";
import {getCalendarPlanCP} from "../../../../utils/getCalendarPlanCP";
import {Gantt, Task} from "gantt-task-react";
import dayjs from "dayjs";
import ProjectCalendarPlanModal from "../../../../components/ProjectCalendarPlanModal/ProjectCalendarPlanModal";
import {ICalendarPlanForm} from "../../../../types/forms";
import {useStore} from "../../../../store";
import {hexGenerator} from "../../../../utils/hexGenerator";
import {getDate} from "../../../../utils/getDate";
import {roleRequired} from "../../../../utils/roleRequired";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography;

const defaultTask: Task[] = [{
    start: new Date(),
    end: new Date(),
    name: '',
    id: '',
    progress: 0,
    type: 'task'
}]

const plansToTable = (plans: ICalendarPlan[]): ITableDataType[] => {
    return plans.map(plan => ({
        key: plan.id,
        id: plan.id,
        name: plan.name,
        status: plan.status,
        type: plan.type,
        start_date_plan: plan.start_date_plan,
        start_date_forecast: plan.start_date_forecast,
        start_date_fact: plan.start_date_fact,
        length_of_days: plan.length_of_days,
        working_days: plan.working_days,
        end_date_plan: plan.end_date_plan,
        end_date_forecast: plan.end_date_forecast,
        end_date_fact: plan.end_date_fact,
        approval_doc: plan.approval_doc,
        users: plan.users,
        children: plan.children
    }))
}

const getStartDate = (plan: ICalendarPlan): Date => {
    if (plan.start_date_fact) return dayjs(plan.start_date_fact).toDate()
    else return dayjs(plan.start_date_plan).toDate()
}

const getEndDate = (plan: ICalendarPlan): Date => {
    if (plan.end_date_fact) return dayjs(plan.end_date_fact).toDate()
    else return dayjs(plan.end_date_plan).toDate()
}

const CalendarPlans = () => {
    const {projectId} = useParams()

    const {
        user: userStore,
        project: projectStore
    } = useStore()

    const [controlPoints, setControlPoints] = useState<ICalendarPlanCP[]>();
    const [plansLoading, setPlansLoading] = useState<boolean>(true);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [tableData, setTableData] = useState<ITableDataType[]>([]);
    const [tasks, setTasks] = useState<Task[]>(defaultTask);

    const fetchPlans = async () => {
        setPlansLoading(true)
        const res = await CalendarPlanApi.getPlans(projectId!)
        setTableData(plansToTable(res.data))
        if (res.data.length !== 0) setTasks([])
        res.data.map(plan => planToTasks(plan))
        setPlansLoading(false)
    };

    const removePoint = async (calendar_plan_id: number) => {
        message.loading('Удаление точки');
        try {
            await CalendarPlanApi.delete(calendar_plan_id);
            fetchPlans().then();
            message.destroy();
        } catch (e) {
            message.destroy();
            message.error('Ошибка удаления точки!');
        }
    };

    const createPoint = async (data: ICalendarPlanForm) => {
        setLoading(true)
        try {
            if (data.type === 'WORK') {
                await CalendarPlanApi.createWork(
                    projectStore.project.id, data.type, data.name, data.awaiting_result,
                    getDate(data.start_date_plan), getDate(data.start_date_forecast),
                    getDate(data.start_date_fact), getDate(data.end_date_plan),
                    getDate(data.end_date_forecast), getDate(data.end_date_fact),
                    userStore.user.id, data.approval_doc!, data.parent_stage_id!
                )
            } else if (data.type === 'CONTROL_POINT') {
                await CalendarPlanApi.createPoint(
                    projectStore.project.id, data.type, data.name,
                    dayjs(data.end_date).format('YYYY-MM-DD'), dayjs(data.end_date).format('YYYY-MM-DD'),
                    dayjs(data.end_date).format('YYYY-MM-DD'), userStore.user.id, data.approval_doc!
                )
            } else {
                await CalendarPlanApi.createStage(projectStore.project.id, data.type, data.name, data.awaiting_result)
            }
            fetchPlans().then()
            setOpenModal(false);
        } catch (e) {
            message.error('Ошибка добавления точки!');
        }

        setLoading(false);
    };

    const planToTasks = (plan: ICalendarPlan, color?: string) => {
        if (!color) color = hexGenerator();

        setTasks(prev => [...prev, {
            start: ['WORK', 'STAGE'].includes(plan.type) ? getStartDate(plan) : getEndDate(plan),
            end: getEndDate(plan),
            name: plan.name,
            id: plan.id.toString(),
            type: ['WORK', 'STAGE'].includes(plan.type) ? 'task' : 'milestone',
            progress: 100,
            isDisabled: true,
            styles: {progressColor: color, progressSelectedColor: color}
        }])

        plan.children?.map((childPlan, index) => (planToTasks(childPlan, color)))
    }

    useEffect(() => {
        const fetchCP = async () => {
            try {
                const res = await CalendarPlanApi.getCP();
                setControlPoints(res.data);
            } catch (e) {
                message.error('Ошибка загрузки обязательных контрольных точек!');
            }
        };

        fetchCP().then()
        fetchPlans().then()
        // eslint-disable-next-line
    }, [projectId]);

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col xs={24}>
                    <Card>
                        <Title level={4} style={{marginBottom: 20}}>Обязательные контрольные точки</Title>
                        <Row justify='center' gutter={[6, 6]} align='stretch'>
                            {
                                controlPoints && !plansLoading
                                    ? (
                                        controlPoints?.map((cp, index) =>
                                            <Col style={{width: 240}} key={index}>
                                                <ProjectBaseCP
                                                    cp={cp}
                                                    title={getCalendarPlanCP(cp.slug, 1)[0]}
                                                    baseColor={getCalendarPlanCP(cp.slug, 1)[1]}
                                                    secondColor={getCalendarPlanCP(cp.slug, 0)[1]}
                                                    value={tableData.find(item => item.type === cp.slug)?.end_date_fact}
                                                    setTableData={setTableData}
                                                    tableData={tableData}
                                                    setTasks={setTasks}
                                                    tasks={tasks}
                                                />
                                            </Col>
                                        )
                                    )
                                    : (
                                        [...Array(5)].map((_, index) => (
                                            <Col style={{width: 240}} key={index}>
                                                <Card loading bordered style={{border: '1px solid #f0f0f0'}}></Card>
                                            </Col>
                                        ))
                                    )
                            }
                        </Row>
                    </Card>
                </Col>
                <Col xs={24}>
                    <Card>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
                            <Title level={4} style={{marginBottom: 20}}>Календарный план</Title>
                            {
                                checkStore([projectStore.project, userStore.user]) && projectStore.editable &&
                                roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users) &&
                                <Button type='primary'
                                        onClick={() => setOpenModal(true)}
                                >Добавить точку</Button>
                            }
                        </div>

                        <div style={{marginBottom: 40}}>
                            <Spin spinning={plansLoading}>
                                <Gantt tasks={tasks} listCellWidth='' locale='ru' rowHeight={25} columnWidth={30} fontSize='12px'/>
                            </Spin>
                        </div>

                        <Table
                            columns={getColumns(removePoint, projectStore.editable, projectStore.project.id,
                                checkStore([projectStore.project, userStore.user]) &&
                                roleRequired(userStore.user.id, ['SUPERVISOR', 'ADMIN', 'DIRECTORATE_CURATOR'], projectStore.project.users))}
                            bordered
                            size='small'
                            dataSource={tableData}
                            scroll={{x: 'max-content'}}
                            loading={plansLoading}
                            pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
                            rowClassName='tableRow'
                            rowKey='id'
                        />
                    </Card>
                </Col>
            </Row>
            <ProjectCalendarPlanModal
                open={openModal}
                loading={loading}
                onClose={() => setOpenModal(false)}
                onSubmit={createPoint}
            />
        </>
    );
};

export default observer(CalendarPlans);