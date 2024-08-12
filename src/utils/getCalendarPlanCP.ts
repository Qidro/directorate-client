import {calendarPlanCP} from "../constants/calendarPlan";

export const getCalendarPlanCP = (cp: string, opacity: any) => {
    if (cp in calendarPlanCP) {
        return [calendarPlanCP[cp].text, calendarPlanCP[cp].color[opacity]]
    }

    return ['Неизвестная стадия', '#9B9B9B']
}