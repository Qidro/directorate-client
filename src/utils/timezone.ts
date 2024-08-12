import {Dayjs} from "dayjs";

export const timezone = (date: Dayjs) => {
    const offset = new Date().getTimezoneOffset()
    return date.subtract(offset, 'minute')
}