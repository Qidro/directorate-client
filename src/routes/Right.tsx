import {FC} from 'react';
import {IRoute} from "./IRoute";
import {Navigate} from "react-router-dom";
import { useStore } from '../store';

const Right: FC<IRoute> = ({right, component}) => {
    const userStore = useStore(store => store.user)
    return (
        <>
            {
                userStore.user.rights.filter(userRight => userRight.slug === right).length > 0
                    ? (() => component)()
                    : <Navigate to='/dashboard' />
            }
        </>
    );
};

export default Right;