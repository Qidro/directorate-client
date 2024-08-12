import React, {FC, useState} from 'react';
import {IAlertProps} from "./IAlertProps";
import {Typography} from "antd";
import style from './Alert.module.scss'
import {CloseOutlined} from "@ant-design/icons";


const {Text} = Typography

const Alert: FC<IAlertProps> = ({text, image}) => {
    const [closed, setClosed] = useState(false)

    if (closed) return null

    return (
        <div className={style.alert}>
            <div className={style.header}>
                {image && <img src={image} alt=''/>}
                <CloseOutlined onClick={() => setClosed(true)}/>
            </div>
            <Text>{text}</Text>
        </div>
    );
};

export default Alert;