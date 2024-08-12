import {useEffect, useState} from 'react';
import {Form, Input, Cascader, Button, message} from 'antd';
import OrgStructureApi from "../../../api/orgStructure-api";
import {MaskedInput} from "antd-mask-input";
import {IRegistration, User} from "../../../types/user";
import UserApi from '../../../api/user-api';

interface Options {
    value: number,
    label: string,
    children? : Options[]
}

type Props = {
    setRegFromOpened: (regFormOpened: boolean) => void;
    setUsersInfo: (usersInfo: User[]) => void;
    usersInfo: User[];
}

const RegForm = ({setRegFromOpened, setUsersInfo, usersInfo}: Props) => {
    const [options, setOptions] = useState<Options[]>([]);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [phoneError, setPhoneError] = useState<boolean>(false);

    const registration = async (login: string, firstname: string, lastname: string, surname: string,
                                password: string, phone: string, email: string, positionId: number) => {
        const res = await UserApi.registration(login, firstname, lastname, surname, password, phone, email, positionId)

        const newUser = {
            key: res.data.id.toString(),
            fullname: res.data.fullname,
            email: res.data.email,
            positionName: res.data.position ? res.data.position.name : 'Не указана',
            departmentName: res.data.position ? res.data.position.department.name : 'Не указан'
        };

        setUsersInfo([...usersInfo, newUser])
    }

    const onFinish = ({login, firstname, lastname, surname, password, phone, email, positionId}:IRegistration) => {
        setButtonLoading(true)

        registration(login, firstname, lastname, surname, password, phone, email, positionId[1]).then(() => {
            setRegFromOpened(false);
            message.success('Пользователь зарегистрирован!');
        }).catch(error => {
            if (error.response.data === 'Login already exist') {
                message.warning('Логин уже используется!');
            } else if (error.response.data === 'Position not found') {
                message.error('Должность не найдена!');
            } else {
                message.error('Ошибка регистрации пользователя!');
            }
        }).finally(() => {
            setButtonLoading(false)
        })
    };

    const getOptionsData = async () => {
        const res = await OrgStructureApi.getDepartments();

        const data: Options[] = res.data.filter(item => item.positions.length !== 0).map((department) => {
            return {
                value: department.id,
                label: department.name,
                children: department.positions.map((position) => {
                    return {
                        value: position.id,
                        label: position.name
                    };
                })
            };
        });

        setOptions(data);
    }

    const checkPhoneError = (value: any) => {
        if (/^\+7 \d{3} \d{3} \d{2} \d{2}$/.test(value)) {
            setPhoneError(false);
        } else {
            setPhoneError(true);
        }
    };

    const onFieldsChange = (data: any) => {
        if (data[0].name[0] === 'phone') checkPhoneError(data[0].value);
    };

    useEffect(() => {
        getOptionsData().then();
    }, []);

    return (
        <Form
            labelCol={{ span: 13 }}
            labelAlign='left'
            layout="horizontal"
            style={{ maxWidth: "100vw", padding: '24px 0 0 0'}}
            name="register"
            onFinish={onFinish}
            onFieldsChange={onFieldsChange}
        >
            <Form.Item label="Логин" name='login' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="E-mail" name='email' rules={[{ required: true, type: 'email' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Пароль" name='password' rules={[{ required: true }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item label="Подтвердите пароль" name={['user', 'confirmPassword']} rules={[{ required: true },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('Пароли не совпадают!'));
                    },
                })]}>
                <Input.Password />
            </Form.Item>
            <Form.Item label="Фамилия" name='lastname' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Имя" name='firstname' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Отчество" name='surname' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Телефон" name='phone' rules={[{ pattern: /^\+7 \d{3} \d{3} \d{2} \d{2}$/,
                message: 'Телефон не соответствует формату' }]}>
                <MaskedInput
                    mask='+7 000 000 00 00'
                    size='middle'
                    status={phoneError ? 'error' : ''}
                />
            </Form.Item>
            <Form.Item label="Отдел / Должность" name='positionId' rules={[{ required: true }]}>
                <Cascader
                    options={options}
                />
            </Form.Item>
            <Form.Item style={{textAlign: 'right'}}>
                <Button type="primary" htmlType="submit" loading={buttonLoading}>Зарегистрировать</Button>
            </Form.Item>
        </Form>
    );
};

export default RegForm;