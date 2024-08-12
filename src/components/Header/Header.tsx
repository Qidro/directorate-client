import style from './Header.module.scss'
import {Dropdown, MenuProps} from "antd";
import {DownOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {Link, useNavigate} from "react-router-dom";
import {useStore} from "../../store";

const Header = () => {
    const navigate = useNavigate()
    const userStore = useStore(store => store.user)

    const onLogout = () => {
        userStore.logout().then(() => {
            navigate('/')
        })
    }

    const items: MenuProps['items'] = [
        {
            key: 'profile',
            label: <Link to='/profile'>Профиль</Link>,
            icon: <UserOutlined />
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            label: <div onClick={onLogout}>Выйти из аккаунта</div>,
            icon: <LogoutOutlined />,
            danger: true
        },
    ];

    return (
        <div className={style.header}>
            <div className={style.user}>
                <Dropdown menu={{items}} trigger={['click']}>
                    <div className={style.text}>
                        {userStore.user.fullname}
                        <DownOutlined />
                    </div>
                </Dropdown>
            </div>
        </div>
    );
};

export default observer(Header);