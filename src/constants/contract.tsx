export const contractStage: { [key: string]: { text: string, color: string } } = {
    INITIATION: {
        text: 'Инициирование',
        color: '9B9B9B'
    },
    DOC_PREPARED: {
        text: 'Готовятся документы',
        color: 'd9b55e'
    },
    COMPETITIVE_PROCEDURES: {
        text: 'Проводятся конкурсные процедуры',
        color: 'becb64'
    },
    SIGNING: {
        text: 'Заключается',
        color: '87d068'
    },
    EXECUTED: {
        text: 'Исполняется',
        color: '87d068'
    }
}

export const contractType: {[key: string] : {text: string}} = {
    CLOSE_AUCTION: {
        text: 'Закрытый аукцион'
    },
    CLOSE_TENDER: {
        text: 'Закрытый конкурс'
    },
    OPEN_AUCTION: {
        text: 'Открытый аукцион'
    },
    OPEN_TENDER: {
        text: 'Открытый конкурс'
    },
    ORDER: {
        text: 'Размещение заказа у единственного поставщика'
    },
    ELECTRONIC_AUCTION: {
        text: 'Электронный аукцион'
    },
}