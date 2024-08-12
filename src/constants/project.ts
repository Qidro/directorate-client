export const projectStage: {[key: string]: {text: string, color: string}} = {
    INITIATION: {
        text: 'Инициирование',
        color: '9B9B9B'
    },
    PREPARATION: {
        text: 'Подготовка',
        color: 'd9b55e'
    },
    REALIZATION: {
        text: 'Реализация',
        color: 'becb64'
    },
    COMPLETION: {
        text: 'Заверешение',
        color: '87d068'
    },
    POST_PROJECT_MONITORING: {
        text: 'Постпроектный мониторинг',
        color: '87d068'
    },
    ARCHIVED: {
        text: 'Архивирован',
        color: 'ff8e0a'
    },
    CANCELED: {
        text: 'Отменен',
        color: 'ff4646'
    },
}

export const projectPriority: {[key: string]: {text: string}} = {
    NORMAL: {
        text: 'Обычный'
    },
    HIGH: {
        text: 'Высокий'
    },
}