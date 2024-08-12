import {FC, useState} from 'react';
import {Button, Layout as AntLayout, Menu} from "antd";
import {ILayoutProps} from "./ILayoutProps";
import style from './Layout.module.scss'
import Header from "../Header/Header";
import {Outlet} from "react-router-dom";
import {MenuOutlined} from "@ant-design/icons";
import {isRunningStandalone} from "../../utils/isStandaloneApp";
import useMenu from "../../hooks/useMenu";

const {Sider, Content} = AntLayout


const Layout: FC<ILayoutProps> = ({menu}) => {
    const [menuItem, selectedMenu] = useMenu(menu)
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const [collapsed, setCollapsed] = useState<boolean>(isRunningStandalone())

    const onSwitchMenu = () => setMenuOpen(prev => !prev)

    const onMenuItemClick = () => menuOpen && setMenuOpen(false)

    const onCollapse = () => setCollapsed(prev => !prev)

    return (
        <AntLayout className={style.layout}>
            <Sider
                theme='light'
                collapsible
                collapsed={!menuOpen ? collapsed : false}
                onCollapse={onCollapse}
                className={[style.sidebar, menuOpen ? style.opened : ''].join(' ')}
            >
                <div className={style.sidebar_content}>
                    <Menu items={menuItem} selectedKeys={selectedMenu} onClick={onMenuItemClick}/>
                </div>
            </Sider>
            <AntLayout>
                <AntLayout.Header className={style.header}>
                    <Button
                        icon={<MenuOutlined />}
                        type='text'
                        className={style.burger}
                        onClick={onSwitchMenu}
                    ></Button>
                    <Header />
                </AntLayout.Header>
                <Content className={style.content}>
                    <Outlet/>
                </Content>
            </AntLayout>
        </AntLayout>
    );
};

export default Layout;