export const evaluationTypeOptions = [
    { value: 'INCREASING', label: 'Возрастающий' },
    { value: 'DECREASING', label: 'Убывающий' },
    { value: 'FIXED', label: 'Фиксированный' },
]

export const evaluationFrequencyOptions  = [
    { value: 'MONTH', label: 'Месяц' },
    { value: 'QUARTER', label: 'Квартал' },
    // { value: 'HALF_YEAR', label: 'Полугодие' },
    { value: 'YEAR', label: 'Год' },
]

export const infoCollectionOptions  = [
    { value: 'ADMIN_INFO', label: 'Административная информация' },
    { value: 'ACCOUNTING_STATEMENTS', label: 'Бухгалтерская отчетность' },
    { value: 'ACCOUNTING', label: 'Единовременное обследование (учет)' },
    { value: 'CENSUS', label: 'Перепись' },
    { value: 'PERIODIC_REPORTING', label: 'Периодическая отчетность' },
    { value: 'SOCIOLOGICAL_SURVEY', label: 'Социологический опрос' },
    { value: 'FINANCIAL_STATEMENTS', label: 'Финансовая отчетность' },
]

export const coverageUnitsOptions  = [
    { value: 'SELECTIVE_OBSERVATION', label: 'Выборочное наблюдение' },
    { value: 'MONOGRAPHIC_OBSERVATION', label: 'Монографическое наблюдение' },
    { value: 'CONTINUOUS_OBSERVATION', label: 'Сплошное наблюдение' },
    { value: 'MAIN_ARRAY', label: 'Способ основного массива' }
]

export const approvalDocOptions  = [
    { value: 'NONE_DOC', label: 'Без утверждающего документа' },
    { value: 'PROPOSAL', label: 'Проектное предложение' },
    { value: 'PASSPORT', label: 'Паспорт' },
    { value: 'WORK_PLAN', label: 'Рабочий план' },
    { value: 'SUMMARY_PLAN', label: 'Сводный план' }
]