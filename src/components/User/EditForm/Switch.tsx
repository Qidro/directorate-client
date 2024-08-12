import {useEffect, useState} from 'react';
import {message, Switch} from "antd";
import UserApi from "../../../api/user-api";
import {IUser} from "../../../types/user";
import {IRight} from "../../../types/right";

type Props = {
    userInfo?: IUser
    right: IRight
}

const MySwitch = ({userInfo, right}: Props) => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsChecked(userInfo ? userInfo.rights.filter(item => (item.id === right.id)).length > 0 : false)
    }, [right.id, userInfo])

    const changeRight = (checked: boolean, rightId: number) => {
        setLoading(true);
        if (checked) {
            UserApi.setRight(userInfo? userInfo.id : 0, rightId).then(() => {
                setIsChecked(true);
                message.success('Право добавлено')
            }).catch(error => {
                if (error.response.data === 'This user already has this right') {
                    message.error('Пользователь уже имеет право!');
                } else if (error.response.data === 'User or right not found') {
                    message.error('Пользователь или право не найдены!');
                }
            }).finally(() => setLoading(false))
        } else {
            UserApi.removeRight(userInfo? userInfo.id : 0, rightId).then(() => {
                setLoading(false);
                setIsChecked(false);
                message.success('Право удалено')
            });
        }
    };

    return (
        <Switch loading={loading}
            checked={isChecked}
            onChange={(checked) => changeRight(checked, right.id)}></Switch>
    );
};

export default MySwitch;