import {useState, FC, useEffect} from 'react';
import {Button, Table, Modal, message, Card, Typography} from 'antd';
import {IUser, User} from "../../../../types/user";
import UserApi from '../../../../api/user-api';
import style from './Users.module.scss'
import RegForm from "../../../../components/User/RegForm/RegForm";
import EditForm from "../../../../components/User/EditForm/EditForm";
import {getColumns} from "./tableData";
import {IUserEditForm} from "../../../../types/forms";
import userApi from "../../../../api/user-api";
import {observer} from "mobx-react-lite";
import {useStore} from "../../../../store";
import CardTitle from "../../../../components/CardTitle/CardTitle";

const {Title} = Typography

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

const Users: FC = () => {
    const [tableData, setTableData] = useState<User[]>([]);
    const [editUserInfo, setEditUserInfo] = useState<IUser>();

    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const [editLoading, setEditLoading] = useState<boolean>(false)

    const [regFormOpened, setRegFormOpened] = useState<boolean>(false);
    const [editFormOpened, setEditFormOpened] = useState<boolean>(false)

    const userStore = useStore(store => store.user)

    useEffect(() => {
        const fetchUsers = async () => {
            setTableLoading(true)

            const res = await UserApi.getUsers();

            setTableData(usersToTableData(res.data));
            setTableLoading(false)
        }

        fetchUsers().then();
    }, []);

    const handleCancel = () => {
        setRegFormOpened(false);
        setEditFormOpened(false);
    };

    const onDelete = async (userId: string) => {
        message.loading('Удаление пользователя');

        try {
            await UserApi.delete(userId)
            setTableData(tableData.filter(item => item.key !== userId))
            message.destroy();
            message.success('Пользователь удален!');
        } catch (_) {
            message.destroy();
            message.error('Ошибка удаления пользователя!')
        }
    }

    const onEdit = async (userId: string) => {
        message.loading('Загрузка данных');

        try {
            const res = await UserApi.getUser(userId)
            setEditUserInfo(res.data);
            setEditFormOpened(true);
            message.destroy();
        } catch (e) {
            message.destroy();

            if (e === 'User not found') {
                message.error('Пользователь не найден!');
            } else {
                message.error('Ошибка загрузки данных пользователя!')
            }
        }
    };

    const onUserInfoChange = async (data: IUserEditForm) => {
        setEditLoading(true)
        const res = await userApi.edit(
            editUserInfo!.id,
            data.login,
            data.firstname,
            data.lastname,
            data.surname,
            data.email,
            data.positionId[1]
        )

        const user = res.data

        setTableData(prev => prev.map(item => {
            if (item.key === user.id.toString()) {
                return {
                    key: user.id.toString(),
                    fullname: user.fullname,
                    email: user.email,
                    positionName: user.position ? user.position.name : 'Не указана',
                    departmentName: user.position ? user.position.department.name : 'Не указан'
                }
            }

            return item
        }))

        message.success('Данные сохранены')
        setEditLoading(false)
        setEditFormOpened(false)
    }

    const onChangePassword = async (password: string) => {
        setEditLoading(true)

        await userApi.changePassword(editUserInfo!.id, password)
        message.success('Пароль изменен')

        setEditLoading(false)
    }

    return (
        <Card>
            <CardTitle>
                <Title level={4}>Пользователи</Title>

                <div className={style.add__user__btn}>
                    <Button
                        type="primary"
                        onClick={() => setRegFormOpened(true)}
                    >Добавить пользователя</Button>
                </div>
            </CardTitle>


            <Table
                loading={tableLoading}
                columns={getColumns(onEdit, onDelete, userStore.user.id.toString())}
                dataSource={tableData}
                bordered scroll={{x: 800}}
                pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
            />

            <Modal
                destroyOnClose
                title="Регистрация пользователя"
                open={regFormOpened}
                onCancel={handleCancel}
                footer={null}
                width={650}
            >
                <RegForm
                    setRegFromOpened={setRegFormOpened}
                    setUsersInfo={setTableData}
                    usersInfo={tableData}
                />
            </Modal>

            <Modal
                destroyOnClose
                title="Редактирование пользователя"
                open={editFormOpened}
                onCancel={handleCancel}
                footer={null}
                width={850}
                bodyStyle={{paddingTop: 20}}
                centered
            >
                <EditForm
                    userInfo={editUserInfo!}
                    onUserFormSubmit={onUserInfoChange}
                    onPasswordChange={onChangePassword}
                    loading={editLoading}
                />
            </Modal>
        </Card>
    );
};

export default observer(Users);