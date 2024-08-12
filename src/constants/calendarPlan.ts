export const calendarPlanCP: { [key: string]: { text: string, color: [string, string] } } = {
    INITIATION: {
        text: 'Инициирование',
        color: [
            'rgba(155,155,155,0.3)',
            '#9B9B9B',
        ]
    },
    PREPARATION: {
        text: 'Подготовка',
        color: [
            'rgba(217,181,94,0.3)',
            '#d9b55e',
        ]
    },
    REALIZATION: {
        text: 'Реализация',
        color: [
            'rgba(190,203,100,0.3)',
            '#becb64',
        ]
    },
    COMPLETION: {
        text: 'Завершение',
        color: [
            'rgba(135,208,104,0.3)',
            '#87d068',
        ]
    },
    POST_PROJECT_MONITORING: {
        text: 'Постпроектный мониторинг',
        color: [
            'rgba(135,208,104,0.3)',
            '#87d068',
        ]
    }
}

export const CPStatus : { [key: string]: { text: string, color: string } } = {
    IN_WORK: {
        text: 'В работе',
        color: '9B9B9B'
    },
    COMPLETE: {
        text: 'Выполнена',
        color: 'becb64'
    },
    CONFIRMED: {
        text: 'Подтверждена',
        color: '87d068'
    },
    OVERDUE: {
        text: 'Просрочена',
        color: 'ff4646'
    },
    FORECAST_FAILURE: {
        text: 'Возможен срыв сроков',
        color: 'd9b55e'
    }
}

export const calendarPlanType: {[key: string]: {text: string}} = {
    WORK: {
        text: 'Работа'
    },
    CONTROL_POINT: {
        text: 'Контрольная точка'
    },
    STAGE: {
        text: 'Этап'
    }
}