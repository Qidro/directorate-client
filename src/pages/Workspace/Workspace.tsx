import {Card, Menu, Typography} from 'antd';
import {Outlet} from "react-router-dom";
import {workspaceMenu} from "../../constants/menu";
import {observer} from "mobx-react-lite";
import useMenu from "../../hooks/useMenu";

const {Title} = Typography

const Workspace = () => {
    const [menu, selectedMenu] = useMenu(workspaceMenu)

    return (
        <>
            <Card>
                <Title level={4} style={{marginBottom: 0}}>Рабочая среда</Title>
                <Menu style={{marginTop: 15}} selectedKeys={selectedMenu} mode="horizontal" items={menu}></Menu>
            </Card>

            <div style={{marginTop: 20}}>
                <Outlet/>
            </div>
        </>
    );
};

export default observer(Workspace);