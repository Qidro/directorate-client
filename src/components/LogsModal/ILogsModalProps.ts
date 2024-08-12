import {IBaseLog} from "../../types/logs";

export interface ILogsModalProps {
    open: boolean,
    logs: IBaseLog[],
    onClose?: () => void,
    onScrolledToEnd?: () => void,
    loading?: boolean
}