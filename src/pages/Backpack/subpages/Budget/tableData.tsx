import {getColumnSearch} from "../../../../utils/getColumnSearch";
import {getProjectStage} from "../../../../utils/getProjectStage";
import {Table, TableColumnsType, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import React from "react";
import {Link} from "react-router-dom";
import {IBackpackProjectBudget} from "../../../../types/backpack";
import {IBudget} from "../../../../types/budget";
import {costsName, fundingSource} from "../../../../constants/budget";

export interface IExpandedTableDataType {
    key: number,
    stage: {
        id: number,
        name: string,
    },
    funding_source: string,
    costs_name: string,
    spending_costs: number,
}

const plansToTable = (budgets: IBudget[]): IExpandedTableDataType[] => {
    return budgets.map(budget => ({
        key: budget.id,
        stage: {
            id: budget.stage.id,
            name: budget.stage.name,
        },
        funding_source: budget.funding_source,
        costs_name: budget.costs_name,
        spending_costs: budget.spending_costs,
    }))
}

export const getExpandedTable = (record: IBackpackProjectBudget) => {
    const columns: TableColumnsType<IExpandedTableDataType> = [
        {
            key: 'stage',
            dataIndex: 'stage',
            title: 'Этап',
            ...getColumnSearch('stage', 'Поиск по наименованию этапа'),
            render: (_, {stage}) => {
                return <Link to={'/project/' + record.id + '/calendar_plan/' + stage.id + '/info'}>
                    {stage.name}
                </Link>
            }
        },
        {
            key: 'funding_source',
            dataIndex: 'funding_source',
            title: 'Источник финансирования',
            filters: [
                {text: 'Собственный средства УГМУ', value: 'OWN_FUNDS'},
                {text: 'Финансирование из "Приоритет 2030"', value: 'PRIORITY_FUNDING'},
                {text: 'Иное финансирование', value: 'OTHER_FUNDING'},
            ],
            onFilter: (value: any, record) => {
                return record.funding_source === value
            },
            render: (_, {funding_source}) => {
                return <>{fundingSource[funding_source].text}</>
            }
        },
        {
            key: 'costs_name',
            dataIndex: 'costs_name',
            title: 'Строка расхода',
            filters: [
                {text: 'Заработная плата', value: 'WAGE'},
                {text: 'Накладные расходы', value: 'OVERHEADS'},
                {text: 'Оборудование', value: 'EQUIPMENT'},
                {text: 'Программное обеспечение', value: 'SOFTWARE'},
                {text: 'Расходные материалы', value: 'CONSUMABLES'},
                {text: 'Командировки', value: 'BUSINESS_TRIPS'},
                {text: 'Обучение', value: 'EDUCATION'},
            ],
            onFilter: (value: any, record) => {
                return record.costs_name === value
            },
            render: (_, {costs_name}) => {
                return <>{costsName[costs_name].text}</>
            }
        },
        {
            key: 'spending_costs',
            dataIndex: 'spending_costs',
            title: 'Затраты',
        }
    ]
    return <Table columns={columns}
                  scroll={{x: 'max-content'}}
                  dataSource={plansToTable(record.budgets)}
                  pagination={false}
                  bordered/>;
}

export const getColumns = () => {
    return [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Наименование',
            width: 300,
            ...getColumnSearch('name', 'Поиск по наименованию и номеру проекта'),
            render: (_, {name, id}) => <Link to={'/project/' + id + '/info'}>{name}</Link>
        },
        {
            key: 'stage',
            dataIndex: 'stage',
            title: 'Стадия',
            width: 250,
            filters: [
                {text: 'Инициирование', value: 'INITIATION'},
                {text: 'Подготовка', value: 'PREPARATION'},
                {text: 'Реализация', value: 'REALIZATION'},
                {text: 'Заверешение', value: 'COMPLETION'},
                {text: 'Постпроектный мониторинг', value: 'POST-PROJECT MONITORING'},
                {text: 'Отменен', value: 'CANCELED'},
            ],
            onFilter: (value: any, record) => {
                return record.status === value
            },
            render: (_, {status}) => {
                const newStage = getProjectStage(status)
                return <Tag color={'#' + newStage[1]}>{newStage[0]}</Tag>
            },
        },
    ] as ColumnsType<IBackpackProjectBudget>
}