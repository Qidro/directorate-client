import {useState} from 'react';
import {Button, Col, Form, Input, message, Row, Typography} from "antd";
import style from './Authorization.module.scss'
import {IdcardFilled, LockFilled} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {IAuthForm} from "../../types/forms";
import {AxiosError} from "axios";
import {useStore} from "../../store";

const {Title} = Typography

const requiredFormItem = {
    required: true,
    message: ''
}

const Authorization = () => {
    const userStore = useStore(store => store.user)
    
    // состояние отвечающая за вход
    const [loading, setLoading] = useState<boolean>(false)
    // состояние отвечающая за регистрацию
    const [registration, setRegistration] = useState<boolean>(false)
    const navigate = useNavigate()

    //функция проверки авторизации пользователя
    const onFinish = async ({login, password}: IAuthForm) => {
        setLoading(true)

        try {
            await userStore.login(login, password)
            navigate('/dashboard')
        } catch (error) {
            const e = error as AxiosError
            if (e.response?.data === 'Wrong login or password') {
                message.error('Неверный логин или пароль')
            }
            if (e.response?.data === 'Forbidden') message.error('Ваш аккаунт не активен!')
        }

        setLoading(false)
    }

    //функция нажатия на кнопку "регистрация" и переназначения на форму регистрации
    const Registration = async () => {
        setRegistration(true)

            try {
                navigate('/registration')
            } catch (error) {
                
                    message.error('Ошибка перназначения')
                }
            

            setRegistration(false)
        }

    return (
        <div className={style.auth}>
            <Row>
                <Col xs={{span: 0}} lg={12}>
                    <div className={style.image}></div>
                </Col>
                <Col xs={24} lg={12}>
                    <div className={style.content}>
                        <div className={style.form}>
                            <div className={style.title}>
                                <Title level={2}>Добро пожаловать!</Title>
                            </div>

                            {/* форма для авторизации */}
                            <Form
                                size='large'
                                onFinish={onFinish}
                            >
                                <Form.Item name='login' rules={[requiredFormItem]}>
                                    <Input placeholder='Логин' prefix={<IdcardFilled className={style.inputIcon} />}/>
                                </Form.Item>
                                <Form.Item name='password' rules={[requiredFormItem]}>
                                    <Input.Password placeholder='Пароль' prefix={<LockFilled className={style.inputIcon} />}/>
                                </Form.Item>
                                <Form.Item>
                                    <Button htmlType='submit' type='primary' block loading={loading}>Продолжить</Button>
                                </Form.Item>
                                
                            </Form>

                            {/* кнопка регистрации */}
                            <Form
                                size='large'
                                onFinish={Registration}
                            >
                            <Form.Item>
                                    <Button htmlType='submit' type='primary' block loading={registration}>Регистрация</Button>
                                </Form.Item>
                                </Form>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Authorization;