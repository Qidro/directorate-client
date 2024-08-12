import React, {FC, useEffect} from 'react';
import {ILogsModalProps} from "./ILogsModalProps";
import {Empty, Modal, Spin} from "antd";
import {useInView} from "react-intersection-observer";
import style from './LogsModal.module.scss'
import {LoadingOutlined} from "@ant-design/icons";
import LogItems from "../LogItems/LogItems";

const LogsModal: FC<ILogsModalProps> = ({open, logs, onScrolledToEnd, onClose, loading}) => {
    const {ref, inView} = useInView({
        threshold: 0
    })

    useEffect(() => {
        if (open && inView && onScrolledToEnd) {
            onScrolledToEnd()
        }
    }, [open, inView]) // eslint-disable-line

    const onCloseHandler = () => {
        if (onClose) onClose()
    }

    return (
        <Modal
            open={open}
            onCancel={onCloseHandler}
            destroyOnClose
            title='Журнал действий'
            footer={false}
        >
            {logs.length !== 0 || loading ? (
                <div className={style.logsWrapper}>
                    <LogItems logs={logs} />
                </div>
            ) : (
                <Empty description='Действий не найдено'/>
            )}

            <div ref={ref}></div>

            {loading && (
                <Spin
                    size='large'
                    indicator={<LoadingOutlined/>}
                    className={style.spin}
                />
            )}
        </Modal>
    );
};

export default LogsModal;