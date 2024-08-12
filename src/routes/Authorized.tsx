import React, {FC} from 'react';
import {IRoute} from "./IRoute";
import {Navigate} from "react-router-dom";
import {useStore} from "../store";

const Authorized: FC<IRoute> = ({component}) => {
    const userStore = useStore(store => store.user)
    return (
        userStore.isAuth ? (() => component)() : <Navigate to='/'/>
    );
};

export default Authorized;