import {ICalendarPlan, ICalendarPlanCP} from "../../types/calendarPlan";
import {ITableDataType} from "../../pages/Project/subpages/CalendarPlans/tableData";
import {Dispatch, SetStateAction} from "react";
import {Task} from "gantt-task-react";

export interface IProjectBaseCPProps {
    cp: ICalendarPlanCP,
    title: string,
    baseColor: string,
    secondColor: string,
    value: any,
    setTableData: Dispatch<SetStateAction<ITableDataType[]>>,
    tableData: ITableDataType[],
    setTasks: Dispatch<SetStateAction<Task[]>>,
    tasks: Task[]
}