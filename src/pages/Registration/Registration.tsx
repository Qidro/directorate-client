import {useState} from 'react';
import {Button, Col, Form, Input, message, Row, Typography} from "antd";
import style from './Registration.module.scss'
import {IdcardFilled, LockFilled, UserOutlined, MailFilled, PhoneFilled} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {IAuthForm} from "../../types/forms";
import {AxiosError} from "axios";
import {useStore} from "../../store";
import {MaskedInput} from "antd-mask-input";

const {Title} = Typography

interface Options {
    value: number,
    label: string,
    children? : Options[]
}


const requiredFormItem = {
    required: true,
    message: ''
}

const Registration = () => {
    const [options, setOptions] = useState<Options[]>([]);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [phoneError, setPhoneError] = useState<boolean>(false);

    const userStore = useStore(store => store.user)
    
    // состояние отвечающая за регистрацию
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    //функция регистрации пользователя
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
                                <Form.Item name='email' rules={[requiredFormItem]}>
                                    <Input placeholder='Почта' prefix={<MailFilled className={style.inputIcon} />}/>
                                </Form.Item>
                                <Form.Item name='FirstPassword' rules={[requiredFormItem]}>
                                    <Input.Password placeholder='Пароль' prefix={<LockFilled className={style.inputIcon} />}/>
                                </Form.Item>
                                <Form.Item name='SecondPassword' rules={[requiredFormItem]}>
                                    <Input.Password placeholder='Подвердите пароль' prefix={<LockFilled className={style.inputIcon} />}/>
                                </Form.Item>
                                <Form.Item name='lastname' rules={[requiredFormItem]}>
                                    <Input placeholder='Фамилия' prefix={<UserOutlined className={style.inputIcon} />}/>
                                </Form.Item>
                                <Form.Item name='firstname' rules={[requiredFormItem]}>
                                    <Input placeholder='Имя' prefix={<UserOutlined className={style.inputIcon} />}/>
                                </Form.Item>
                                <Form.Item name='surname' rules={[requiredFormItem]}>
                                    <Input placeholder='Отчество' prefix={<UserOutlined className={style.inputIcon} />}/>
                                </Form.Item>
                                <Form.Item label="Телефон" name='phone' rules={[{ pattern: /^\+7 \d{3} \d{3} \d{2} \d{2}$/,
                                message: 'Телефон не соответствует формату' }]}>
                                <MaskedInput
                                    mask='+7 000 000 00 00'
                                    size='middle'
                                    status={phoneError ? 'error' : ''}
                                />
                            </Form.Item>

                                <Form.Item name='SecondPassword' rules={[requiredFormItem]}>
                                    <Input placeholder='Телефон' prefix={<PhoneFilled className={style.inputIcon} />}/>
                                </Form.Item>
                                <Form.Item name='SecondPassword' rules={[requiredFormItem]}>
                                    <Input.Password placeholder='Должность' prefix={<LockFilled className={style.inputIcon} />}/>
                                </Form.Item>
                                
                                <Form.Item>
                                    <Button htmlType='submit' type='primary' block loading={loading}>Зарегистрироватся</Button>
                                </Form.Item>
                                
                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Registration;