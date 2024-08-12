import {useCallback, useState} from "react";
import {IBaseLog} from "../types/logs";
import {AxiosResponse} from "axios";

type RemoveLastArg<T extends any[]> = T extends [...infer U, any] ? U : never;
type FetcherType = (...args: any[]) => Promise<AxiosResponse<IBaseLog[]>>

export const useLogs = <T extends FetcherType>(
    fetcher: T,
    ...args: RemoveLastArg<Parameters<T>>
) => {
    type LogType = Awaited<ReturnType<typeof fetcher>>['data'][number]

    const [logs, setLogs] = useState<LogType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [end, setEnd] = useState<boolean>(false)

    const loadLogs = useCallback(async () => {
        if (end) return
        setLoading(true)

        const res = await fetcher(...args, logs.length)
        setLogs(prev => [...prev, ...res.data])

        if (res.data.length < 20) setEnd(true)
        setLoading(false)
    }, [end, fetcher, args, logs.length])

    return [logs, loadLogs, loading] as [LogType[], VoidFunction, boolean]
}