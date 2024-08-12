export const indicatorStatus: {[key: string] : {text: string, color: string}} = {
    AWAITING: {
        text: 'Ожидается',
        color: '9B9B9B'
    },
    ACHIEVED: {
        text: 'Достигнут',
        color: '87d068'
    },
    DISRUPTION: {
        text: 'Срыв',
        color: 'd9b55e'
    },
}

export const indicatorEvaluationType: {[key: string] : {text: string}} = {
    INCREASING: {
        text: 'Возрастающий'
    },
    DECREASING: {
        text: 'Убывающий'
    },
    FIXED: {
        text: 'Фиксированный'
    },
}

export const indicatorEvaluationFrequency: {[key: string] : {text: string}} = {
    MONTH: {
        text: 'Месяц'
    },
    QUARTER: {
        text: 'Квартал'
    },
    HALF_YEAR: {
        text: 'Полугодие'
    },
    YEAR: {
        text: 'Год'
    },
}

export const indicatorInfoCollectionMethod: {[key: string] : {text: string}} = {
    ADMIN_INFO: {
        text: 'Административная информация'
    },
    ACCOUNTING_STATEMENTS: {
        text: 'Бухгалтерская отчетность'
    },
    ACCOUNTING: {
        text: 'Единовременное обследование (учет)'
    },
    CENSUS: {
        text: 'Перепись'
    },
    PERIODIC_REPORTING: {
        text: 'Периодическая отчетность'
    },
    SOCIOLOGICAL_SURVEY: {
        text: 'Социологический опрос'
    },
    FINANCIAL_STATEMENTS: {
        text: 'Финансовая отчетность'
    },
}

export const indicatorCoverageUnits: {[key: string] : {text: string}} = {
    SELECTIVE_OBSERVATION: {
        text: 'Выборочное наблюдение'
    },
    MONOGRAPHIC_OBSERVATION: {
        text: 'Монографическое наблюдение'
    },
    CONTINUOUS_OBSERVATION: {
        text: 'Сплошное наблюдение'
    },
    MAIN_ARRAY: {
        text: 'Способ основного массива'
    },
}

export const indicatorApprovalDoc: {[key: string] : {text: string}} = {
    NONE_DOC: {
        text: 'Без утверждающего документа'
    },
    PROPOSAL: {
        text: 'Проектное предложение'
    },
    PASSPORT: {
        text: 'Паспорт'
    },
    WORK_PLAN: {
        text: 'Рабочий план'
    },
    SUMMARY_PLAN: {
        text: 'Сводный план'
    },
}