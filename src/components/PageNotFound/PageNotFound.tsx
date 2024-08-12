import React from 'react';
import noContent from "../../assets/nocontent.svg";
import {Result} from "antd";

const PageNotFound = () => {
    return (
        <Result
            icon={<img src={noContent} alt='' width={350}/>}
            title='Ой..'
            subTitle='Тут ничего нет, но кажется что-то будет'
        />
    );
};

export default PageNotFound;