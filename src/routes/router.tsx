import {createBrowserRouter, Navigate} from "react-router-dom";
import Unauthorized from "./Unauthorized";
import Authorized from "./Authorized";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import UserInfo from "../pages/Profile/subpages/UserInfo/UserInfo";
import Workspace from "../pages/Workspace/Workspace";
import Users from "../pages/Workspace/subpages/Users/Users";
import OrgStructure from "../pages/Workspace/subpages/OrgStructure/OrgStructure";
import Proposals from "../pages/Proposals/Proposals";
import Right from "./Right";
import Proposal from "../pages/Proposal/Proposal";
import Experts from "../pages/Proposal/subpages/Experts/Experts";
import Comment from "../pages/Proposal/subpages/Comment/Comment";
import Verdict from "../pages/Proposal/subpages/Verdict/Verdict";
import ProposalInfo from "../pages/Proposal/subpages/Info/ProposalInfo";
import ExpertsComments from "../pages/Proposal/subpages/ExpertsComments/ExpertsComments";
import Projects from "../pages/Projects/Projects";
import Authorization from "../pages/Authorization/Authorization";
import Backpacks from "../pages/Backpacks/Backpacks";
import Project from "../pages/Project/Project";
import ProjectInfo from '../pages/Project/subpages/Info/ProjectInfo';
import Indicators from "../pages/Project/subpages/Indicators/Indicators";
import Results from "../pages/Project/subpages/Results/Results";
import Budget from "../pages/Project/subpages/Budget/Budget";
import Contracts from "../pages/Project/subpages/Contracts/Contracts";
import Resources from "../pages/Project/subpages/Resources/Resources";
import Documents from "../pages/Project/subpages/Documents/Documents";
import Indicator from "../pages/Indicator/Indicator";
import IndicatorInfo from "../pages/Indicator/subpages/Info/IndicatorInfo";
import IndicatorValues from "../pages/Indicator/subpages/Values/IndicatorValues";
import Result from "../pages/Result/Result";
import ResultInfo from "../pages/Result/subpages/ResultInfo/ResultInfo";
import ResultValues from "../pages/Result/subpages/ResultValues/ResultValues";
import Contract from "../pages/Contract/Contract";
import ContractInfo from "../pages/Contract/subpages/Info/ContractInfo";
import ContractDocuments from "../pages/Contract/subpages/Documents/ContractDocuments";
import CalendarPlanInfo from "../pages/CalendarPlan/subpages/Info/CalendarPlanInfo";
import CalendarPlans from "../pages/Project/subpages/CalendarPlans/CalendarPlans";
import CalendarPlan from "../pages/CalendarPlan/CalendarPlan";
import Backpack from "../pages/Backpack/Backpack";
import BackpackInfo from "../pages/Backpack/subpages/Info/BackpackInfo";
import BackpackIndicators from "../pages/Backpack/subpages/Indicators/BackpackIndicators";
import BackpackCalendarPlan from "../pages/Backpack/subpages/CalendarPlan/BackpackCalendarPlan";
import BackpackBudget from "../pages/Backpack/subpages/Budget/BackpackBudget";
import Layout from "../components/Layout/Layout";
import {menu} from "../constants/menu";
import Archive from "../pages/Workspace/subpages/Archive/Archive";
import ArchivedUsers from "../pages/Workspace/subpages/Archive/subpages/ArchivedUsers/ArchivedUsers";
import ArchivedProposals from "../pages/Workspace/subpages/Archive/subpages/ArchivedProposals/ArchivedProposals";
import ArchivedProjects from "../pages/Workspace/subpages/Archive/subpages/ArchivedProjects/ArchivedProjects";
import Registration from "../pages/Registration/Registration";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Unauthorized component={
                <Authorization />
            }/>
    },
    {
        element: <Authorized component={
            <Layout menu={menu}/>
        }/>,
        children: [
            {
                // мои изменения
                path: '/registration',
                element: <Registration />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/proposals',
                element: <Proposals />
            },
            {
                path: '/profile',
                element: <Profile />,
                children: [
                    {
                        path: '',
                        element: <UserInfo />
                    }
                ]
            },
            {
                path: '/workspace',
                element: <Right right='SYSTEM_ADMIN' component={
                    <Workspace/>
                }/>,
                children: [
                    {
                        path: 'users',
                        element: <Users/>
                    },
                    {
                        path: 'org_structure',
                        element: <OrgStructure/>
                    },
                    {
                        path: 'archive',
                        element: <Archive/>,
                        children: [
                            {
                                path: 'users',
                                element: <ArchivedUsers/>
                            },
                            {
                                path: 'proposals',
                                element: <ArchivedProposals/>
                            },
                            {
                                path: 'projects',
                                element: <ArchivedProjects/>
                            },
                            {
                                path: '',
                                element: <Navigate to='/' />
                            }
                        ]
                    },
                    {
                        path: '',
                        element: <Navigate to='/' />
                    },
                ]
            },
            {
                path: '/proposal/:number',
                element: <Proposal />,
                children: [
                    {
                        path: 'info',
                        element: <ProposalInfo />
                    },
                    {
                        path: 'experts',
                        element: <Experts />
                    },
                    {
                        path: 'comments',
                        element: <ExpertsComments />
                    },
                    {
                        path: 'comment',
                        element: <Comment />
                    },
                    {
                        path: 'verdict',
                        element: <Verdict />
                    },
                    {
                        path: '',
                        element: <Navigate to='/' />
                    },
                ]
            },
            {
                path: '/backpacks',
                element: <Backpacks/>
            },
            {
                path: '/projects',
                element: <Projects/>
            },
            {
                path: '/project/:projectId',
                element: <Project/>,
                children: [
                    {
                        path: 'info',
                        element: <ProjectInfo />
                    },
                    {
                        path: 'indicators',
                        element: <Indicators />
                    },
                    {
                        path: 'results',
                        element: <Results />
                    },
                    {
                        path: 'calendar_plan',
                        element: <CalendarPlans/>
                    },
                    {
                        path: 'budget',
                        element: <Budget />
                    },
                    {
                        path: 'contracts',
                        element: <Contracts />
                    },
                    {
                        path: 'resources',
                        element: <Resources />
                    },
                    {
                        path: 'documents',
                        element: <Documents />
                    },
                    {
                        path: '',
                        element: <Navigate to='/' />
                    }
                ]
            },
            {
                path: '/project/:projectId/indicator/:indicatorId',
                element: <Indicator/>,
                children: [
                    {
                        path: 'info',
                        element: <IndicatorInfo />
                    },
                    {
                        path: 'values',
                        element: <IndicatorValues />
                    },
                    {
                        path: '',
                        element: <Navigate to='/' />
                    }
                ]
            },
            {
                path: '/project/:projectId/result/:resultId',
                element: <Result/>,
                children: [
                    {
                        path: 'info',
                        element: <ResultInfo/>
                    },
                    {
                        path: 'values',
                        element: <ResultValues/>
                    },
                    {
                        path: '',
                        element: <Navigate to='/' />
                    }
                ]
            },
            {
                path: '/project/:projectId/contract/:contractId',
                element: <Contract/>,
                children: [
                    {
                        path: 'info',
                        element: <ContractInfo/>
                    },
                    {
                        path: 'documents',
                        element: <ContractDocuments/>
                    },
                    {
                        path: '',
                        element: <Navigate to='/' />
                    }
                ]
            },
            {
                path: '/project/:projectId/calendar_plan/:calendarPlanId',
                element: <CalendarPlan/>,
                children: [
                    {
                        path: 'info',
                        element: <CalendarPlanInfo/>
                    },
                    {
                        path: '',
                        element: <Navigate to='/' />
                    }
                ]
            },
            {
                path: '/backpack/:backpackId',
                element: <Backpack/>,
                children: [
                    {
                        path: 'info',
                        element: <BackpackInfo/>
                    },
                    {
                        path: 'indicators',
                        element: <BackpackIndicators/>
                    },
                    {
                        path: 'calendar_plan',
                        element: <BackpackCalendarPlan/>
                    },
                    {
                        path: 'budget',
                        element: <BackpackBudget/>
                    },
                    {
                        path: '',
                        element: <Navigate to='/' />
                    }
                ]
            },
        ]
    },
    {
        path: '/*',
        element: <Navigate to='/' />
    },
]);