import {FC} from 'react';
import {IRoute} from "./IRoute";
import {Navigate} from "react-router-dom";
import { useStore } from '../store';

const Unauthorized: FC<IRoute> = ({component}) => {
    const userStore = useStore(store => store.user)
    return (
        !userStore.isAuth ? (() => component)() : <Navigate to='/dashboard'/>
    );
};

export default Unauthorized;