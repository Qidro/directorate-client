export const proposalStatus: {[key: string]: {text: string, color: string}} = {
    SUCCESS: {
        text: 'Согласован',
        color: '87d068'
    },
    REJECT: {
        text: 'Отправлен на доработку',
        color: 'f50'
    },
    REVIEW: {
        text: 'Подан на рассмотрение',
        color: '9B9B9B'
    },
    EXPERTS_EVALUATE: {
        text: 'Рассматривается экспертами',
        color: 'd9b55e'
    },
    DIRECTOR_EVALUATE: {
        text: 'Рассматривается комиссией',
        color: 'becb64'
    },
    ARCHIVED: {
        text: 'Архивирован',
        color: '9B9B9B'
    },
}

export const expertsStatus: {[key: string]: {text: string, color: string}} = {
    SUCCESS: {
        text: 'Согласован',
        color: '87d068'
    },
    REJECT: {
        text: 'Отправлен на доработку',
        color: 'f50'
    }
}