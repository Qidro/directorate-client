import {ColumnType} from "antd/es/table";
import dayjs from "dayjs";


export const getColumnDateSorter = (dataIndex: string): ColumnType<any> => {

    return {
        sorter: (a, b) => {
            if (!a[dataIndex] || !b[dataIndex]) return 0;
            return dayjs(a[dataIndex]).isAfter(dayjs(b[dataIndex])) ? 1 : -1
        }
    }
}