import {useEffect, useState} from 'react';
import {RouterProvider} from "react-router-dom";
import {LoadingOutlined} from "@ant-design/icons";
import AlertApi from "./api/alert-api";
import Alert from "./components/Alert/Alert";
import devLogo from './assets/dev.svg'
import {router} from "./routes/router";
import {useStore} from "./store";
import {observer} from "mobx-react-lite";

function App() {
    const userStore = useStore(store => store.user)
    const [loading, setLoading] = useState<boolean>(true);
    const [alert, setAlert] = useState<string>();

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true)
            try {
                await userStore.check()
            } catch (e) {}
            setLoading(false)
        }

        const fetchAlert = async () => {
            try {
                const res = await AlertApi.getAlert();
                setAlert(res.data.text !== '' ? res.data.text : undefined);
            } catch (e) {
                setAlert(undefined)
            }
        }

        checkAuth().then()
        fetchAlert().then()
    }, [userStore])

    return (
        loading ? <>
            <div className="loading-container">
                <LoadingOutlined className='loading'/>
            </div>
        </> : <>
            { alert && <Alert text={alert} image={devLogo}/> }
            <RouterProvider router={router}/>
        </>
    );
}

export default observer(App);
