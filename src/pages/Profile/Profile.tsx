import {useEffect, useState} from 'react';
import style from './Profile.module.scss'
import {Card, Menu} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {Typography} from "antd";
import {observer} from "mobx-react-lite";
import {profileMenu} from "../../constants/menu";
import {Outlet, useLocation} from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import {useStore} from "../../store";
import {MenuItem} from "../../types/menu";

const {Title, Text} = Typography

const Profile = () => {
    const userStore = useStore(store => store.user)
    useDocumentTitle(userStore.user.fullname)

    const location = useLocation()
    const [menu, setMenu] = useState<MenuItem[]>([])

    useEffect(() => {
        setMenu(
            profileMenu.filter(item =>
                item.right
                ? userStore.checkRight(item.right)
                : item
            ).map(item => ({
                key: item.key,
                label: item.label,
                icon: item.icon,
            }))
        )
    }, [userStore])

    return (
        <div className={style.profile}>
            <Card style={{marginBottom: 20}}>
                <div className={style.userInfo}>
                    <div className={style.avatar}>
                        <UserOutlined />
                    </div>
                    <div className="text">
                        <Title level={4}>{userStore.user.fullname}</Title>
                        <Text type='secondary'>{userStore.user.position?.name}</Text>
                    </div>
                </div>

                <Menu
                    items={menu}
                    selectedKeys={[location.pathname]}
                    mode='horizontal'
                />
            </Card>

            <Outlet />
        </div>
    );
};

export default observer(Profile);