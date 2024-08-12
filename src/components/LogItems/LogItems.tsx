import React, {FC, useMemo} from 'react';
import {ILogItemsProps} from "./ILogItemsProps";
import {
    ClockCircleOutlined,
    InfoCircleOutlined,
    MinusCircleOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import {Timeline, Typography} from "antd";
import {timezone} from "../../utils/timezone";
import dayjs from "dayjs";
import style from './LogItems.module.scss'

const {Text} = Typography

const getActionAssets = (action: string) => {
    const actionFirstPart = action.split('_')[0]

    switch (actionFirstPart) {
        case 'CREATE':
        case 'ADD':
        case 'SET':
        case 'UPLOAD':
            return {icon: <PlusCircleOutlined/>, color: '#22c55e'}

        case 'DELETE':
        case 'REMOVE':
            return {icon: <MinusCircleOutlined/>, color: '#e63636'}

        case 'UPDATE':
            return {icon: <ClockCircleOutlined/>, color: '#0ea5e9'}
    }

    return {icon: <InfoCircleOutlined/>, color: undefined}
}

const LogItems: FC<ILogItemsProps> = ({logs}) => {
    const items = useMemo(() => {
        return logs.map(log => {
            const assets = getActionAssets(log.action)
            const date = dayjs(log.date_change + ' ' + log.time_change)
            const formattedDate = timezone(date).format('DD.MM.YYYY HH:mm')

            return {
                color: assets.color,
                dot: assets.icon,
                children: <span className={style.text}>
                    <Text>{log.message}</Text>
                    <Text type='secondary'>{formattedDate}</Text>
                </span>
            }
        })
    }, [logs])

    return (
        <Timeline items={items}/>
    );
};

export default React.memo(LogItems);