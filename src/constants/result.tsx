export const resultStatus: { [key: string]: { text: string, color: string } } = {
    IN_PROGRESS: {
        text: 'В работе',
        color: '9B9B9B'
    },
    COMPLETED: {
        text: 'Выполнен',
        color: '87d068'
    },
    ACHIEVED: {
        text: 'Достигнут',
        color: '87d068'
    },
    CANCELED: {
        text: 'Отменен',
        color: 'ff4646'
    }
}