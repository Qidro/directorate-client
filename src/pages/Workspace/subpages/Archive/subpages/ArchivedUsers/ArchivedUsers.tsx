import React, {useEffect, useState} from 'react';
import {message, Table} from "antd";
import {getColumns} from "./tableData";
import {IUser, User} from "../../../../../../types/user";
import userApi from "../../../../../../api/user-api";
import UserApi from "../../../../../../api/user-api";

const usersToTableData = (users: IUser[]) => {
    return users.map((user) => {
        return {
            key: user.id.toString(),
            fullname: user.fullname,
            email: user.email,
            positionName: user.position ? user.position.name : 'Не указана',
            departmentName: user.position ? user.position.department.name : 'Не указан'
        }
    });
}

const ArchivedUsers = () => {
    const [tableData, setTableData] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            const res = await userApi.getArchivedUsers()
            setTableData(usersToTableData(res.data))
            setLoading(false)
        }

        fetchUsers().then()
    }, []);

    const onRestore = async (userId: string) => {
        message.loading('Восстановление пользователя');
        setLoading(true)

        try {
            await UserApi.restore(Number(userId))
            setTableData(prev => prev.filter(user => user.key !== userId))
            message.destroy();
            message.success('Пользователь восстановлен!');
        } catch (_) {
            message.destroy();
            message.error('Ошибка при восстановлении пользователя');
        }

        setLoading(false)
    }

    return (
        <Table
            bordered
            columns={getColumns(onRestore)}
            dataSource={tableData}
            loading={loading}
            pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
            scroll={{x: 800}}
        />
    );
};

export default ArchivedUsers;