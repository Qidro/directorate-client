import dayjs from "dayjs";

export const getDate = (date: Date) => {
    if (dayjs(date).isValid()) return dayjs(date).format('YYYY-MM-DD')
    else return undefined
}