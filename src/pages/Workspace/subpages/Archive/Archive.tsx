import React from 'react';
import {Card, Select, Typography} from "antd";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import CardTitle from "../../../../components/CardTitle/CardTitle";

const {Title} = Typography

const options = [
    {
        label: 'Пользователи',
        value: '/workspace/archive/users'
    },
    {
        label: 'Проектные предложения',
        value: '/workspace/archive/proposals'
    },
    {
        label: 'Проекты',
        value: '/workspace/archive/projects'
    },
]

const Archive = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const onSelect = (value: string) => {
        navigate(value)
    }

    return (
        <Card style={{marginBottom: 15}}>
            <CardTitle>
                <Title level={4}>Архив</Title>
                <Select
                    options={options}
                    defaultValue={location.pathname}
                    onSelect={onSelect}
                    style={{minWidth: 200}}
                />
            </CardTitle>

            <Outlet/>
        </Card>
    );
};

export default Archive;