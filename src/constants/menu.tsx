import {
    HomeOutlined,
    UnorderedListOutlined,
    RadarChartOutlined,
    UserOutlined,
    ApartmentOutlined,
    TeamOutlined,
    CommentOutlined,
    FormOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    ProjectOutlined,
    ContainerOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
    ReconciliationOutlined,
    PaperClipOutlined,
    BankOutlined, DeploymentUnitOutlined, FolderOutlined
} from "@ant-design/icons";
import {Link} from "react-router-dom";
import React from "react";
import {IMenu} from "../types/menu";

export const menu: IMenu[] = [
    {
        key: 'dashboard',
        locations: ['/dashboard'],
        label: <Link to='/dashboard'>Главная панель</Link>,
        icon: <HomeOutlined/>
    },
    {
        key: 'proposals',
        locations: ['/proposals', '/proposal'],
        label: <Link to='/proposals'>Проектные предложения</Link>,
        icon: <UnorderedListOutlined />
    },
    {
        key: 'backpacks',
        locations: ['/backpacks', '/backpack'],
        label: <Link to='/backpacks'>Портфели</Link>,
        icon: <ApartmentOutlined />
    },
    {
        key: 'projects',
        locations: ['/projects', '/project'],
        label: <Link to='/projects'>Проекты</Link>,
        icon: <ProjectOutlined />
    },
    {
        key: 'workspace',
        locations: ['/workspace'],
        label: <Link to='/workspace/users'>Рабочая среда</Link>,
        icon: <RadarChartOutlined />,
        right: 'SYSTEM_ADMIN'
    },
]

export const profileMenu: IMenu[] = [
    {
        key: '/profile',
        locations: ['/profile'],
        label: <Link to='/profile'>Общая информация</Link>
    }
]

export const workspaceMenu: IMenu[] = [
    {
        key: 'users',
        locations: ['/workspace/users'],
        label: <Link to='/workspace/users'>Пользователи</Link>,
        icon: <UserOutlined />,
    },
    {
        key: 'orgStructure',
        locations: ['/workspace/org_structure'],
        label: <Link to='/workspace/org_structure'>Структура организации</Link>,
        icon: <ApartmentOutlined />,
    },
    {
        key: 'archive',
        locations: ['/workspace/archive'],
        label: <Link to='/workspace/archive/users'>Архив</Link>,
        icon: <FolderOutlined />
    }
]

export const proposalMenu: IMenu[] = [
    {
        key: 'info',
        locations: ['/proposal/*/info'],
        label: <Link to='info'>Общая информация</Link>,
        icon: <InfoCircleOutlined />
    },
    {
        key: 'experts',
        locations: ['/proposal/*/experts'],
        label: <Link to='experts'>Эксперты</Link>,
        icon: <TeamOutlined />,
        right: 'DIRECTOR-EX'
    },
    {
        key: 'comments',
        locations: ['/proposal/*/comments'],
        label: <Link to='comments'>Комментарии экспертов</Link>,
        icon: <CommentOutlined />,
    },
    {
        key: 'comment',
        locations: ['/proposal/*/comment'],
        label: <Link to='comment'>Оставить комментарий</Link>,
        icon: <FormOutlined />,
        right: 'EXPERT-EX',
    },
    {
        key: 'verdict',
        locations: ['/proposal/*/verdict'],
        label: <Link to='verdict'>Заключение</Link>,
        icon: <CheckCircleOutlined />,
    }
]

export const projectMenu: IMenu[] = [
    {
        key: 'info',
        locations: ['/project/*/info'],
        label: <Link to='info'>Общая информация</Link>,
        icon: <InfoCircleOutlined />
    },
    {
        key: 'indicators',
        locations: ['/project/*/indicators'],
        label: <Link to='indicators'>Показатели</Link>,
        icon: <ReconciliationOutlined />
    },
    {
        key: 'results',
        locations: ['/project/*/results'],
        label: <Link to='results'>Результаты</Link>,
        icon: <CheckCircleOutlined />
    },
    {
        key: 'calendar_plan',
        locations: ['/project/*/calendar_plan'],
        label: <Link to='calendar_plan'>Календарный план</Link>,
        icon: <ClockCircleOutlined />
    },
    {
        key: 'budget',
        locations: ['/project/*/budget'],
        label: <Link to='budget'>Бюджет</Link>,
        icon: <BankOutlined />
    },
    {
        key: 'contracts',
        locations: ['/project/*/contracts'],
        label: <Link to='contracts'>Контракты</Link>,
        icon: <FileTextOutlined />
    },
    {
        key: 'resources',
        locations: ['/project/*/resources'],
        label: <Link to='resources'>Ресурсы</Link>,
        icon: <DeploymentUnitOutlined />
    },
    {
        key: 'documents',
        locations: ['/project/*/documents'],
        label: <Link to='documents'>Документы</Link>,
        icon: <ContainerOutlined />
    },
]

export const indicatorMenu: IMenu[] = [
    {
        key: 'info',
        locations: ['/project/*/indicator/*/info'],
        label: <Link to='info'>Общая информация</Link>,
        icon: <InfoCircleOutlined />
    },
    {
        key: 'values',
        locations: ['/project/*/indicator/*/values'],
        label: <Link to='values'>Значения</Link>,
        icon: <PaperClipOutlined />,
    }
]

export const resultMenu: IMenu[] = [
    {
        key: 'info',
        locations: ['/project/*/result/*/info'],
        label: <Link to='info'>Общая информация</Link>,
        icon: <InfoCircleOutlined />
    },
    {
        key: 'values',
        locations: ['/project/*/result/*/values'],
        label: <Link to='values'>Значения</Link>,
        icon: <PaperClipOutlined />,
    }
]

export const contractMenu: IMenu[] = [
    {
        key: 'info',
        locations: ['/project/*/contract/*/info'],
        label: <Link to='info'>Общая информация</Link>,
        icon: <InfoCircleOutlined />
    },
    {
        key: 'documents',
        locations: ['/project/*/contract/*/documents'],
        label: <Link to='documents'>Документы</Link>,
        icon: <FileTextOutlined />,
    }
]

export const calendarPlanMenu: IMenu[] = [
    {
        key: 'info',
        locations: ['/project/*/calendar_plan/*/info'],
        label: <Link to='info'>Общая информация</Link>,
        icon: <InfoCircleOutlined />
    },
]

export const backpackMenu: IMenu[] = [
    {
        key: 'info',
        locations: ['/backpack/*/info'],
        label: <Link to='info'>Общая информация</Link>,
        icon: <InfoCircleOutlined />
    },
    {
        key: 'indicators',
        locations: ['/backpack/*/indicators'],
        label: <Link to='indicators'>Показатели</Link>,
        icon: <ReconciliationOutlined />
    },
    {
        key: 'calendar_plan',
        locations: ['/backpack/*/calendar_plan'],
        label: <Link to='calendar_plan'>Календарный план</Link>,
        icon: <ClockCircleOutlined />
    },
    {
        key: 'budget',
        locations: ['/backpack/*/budget'],
        label: <Link to='budget'>Бюджет</Link>,
        icon: <BankOutlined />
    },
]