import React, {useMemo, useState} from 'react';
import {Card, Col, DatePicker, Row, Typography} from "antd";
import CardTitle from "../../components/CardTitle/CardTitle";
import MyProjects from "./widgets/MyProjects/MyProjects";
import style from './Dashboard.module.scss'
import CalendarPlan from "./widgets/CalendarPlan/CalendarPlan";
import {useStore} from "../../store";
import Counter from "./widgets/Counter/Counter";
import {useDashboardData} from "../../hooks/useDashboardData";
import Proposals from "./widgets/Proposals/Proposals";
import ProjectsCount from "./widgets/ProjectsCount/ProjectsCount";

const {Title} = Typography;
const {RangePicker} = DatePicker;

const Dashboard = () => {
    const [date, setDate] = useState<[string, string]>(['2000-01-01', '3000-01-01'])

    const {common, advanced} = useDashboardData(date[0], date[1])

    const userStore = useStore(store => store.user)
    const isFullAccess = useMemo(() => {
        return userStore.checkRight('RECTOR') || userStore.checkRight('SYSTEM_ADMIN') || userStore.checkRight('DIRECTOR-EX')
    }, [userStore])

    const onRangeChange = (dates: any) => {
        if (!dates) {
            setDate(['2000-01-01', '3000-01-01'])
            return
        }
        setDate([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')])
    }

    return (
        <div className={style.dashboard}>
            <Card>
                <CardTitle style={{marginBottom: 0}}>
                    <Title level={4}>Главная панель</Title>
                    <RangePicker onChange={onRangeChange}/>
                </CardTitle>
            </Card>

            <Row gutter={[15, 15]}>
                <Col xs={24} lg={10}>
                    <MyProjects
                        projects={common.data?.projects || []}
                        loading={common.loading}
                        verticalScroll={isFullAccess ? 185 : undefined}
                    />
                </Col>
                <Col xs={24} lg={14}>
                    <CalendarPlan
                        calendarPlans={common.data?.calendar_plan || []}
                        loading={common.loading}
                        verticalScroll={isFullAccess ? 185 : undefined}
                    />
                </Col>
            </Row>

            {isFullAccess && (
                <Row gutter={[15, 15]}>
                    <Col xs={24} lg={9}>
                        <Proposals
                            success={advanced.data?.proposal_count_list.success || 0}
                            reject={advanced.data?.proposal_count_list.reject || 0}
                            archived={advanced.data?.proposal_count_list.archived || 0}
                            loading={advanced.loading}
                        />
                    </Col>
                    <Col xs={24} lg={9}>
                        <ProjectsCount
                            data={advanced.data?.project_count_list}
                            loading={advanced.loading}
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <Counter
                            proposalCount={advanced.data?.proposal_count || 0}
                            projectCount={advanced.data?.project_count || 0}
                            backpackCount={advanced.data?.backpack_count || 0}
                            loading={advanced.loading}
                        />
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default Dashboard;