import {useEffect, useState} from 'react';
import {Button, Cascader, Col, Form, Input, message, Row, Typography} from "antd";
import style from './Registration.module.scss'
import {IdcardFilled, LockFilled, UserOutlined, MailFilled, PhoneFilled} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {IAuthForm} from "../../types/forms";
import OrgStructureApi from "../../api/orgStructure-api";
import {AxiosError} from "axios";
import {useStore} from "../../store";
import {MaskedInput} from "antd-mask-input";
import {IRegistration, User} from "../../types/user";
import UserApi from '../../api/user-api';

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

type Props = {
    setRegFromOpened: (regFormOpened: boolean) => void;
   
    usersInfo: User[];
}

const Registration = ({setRegFromOpened}: Props) => {
    const [options, setOptions] = useState<Options[]>([]);
    const [loading, setLoading] = useState(false);
    const [phoneError, setPhoneError] = useState<boolean>(false);

    const registration = async (login: string, firstname: string, lastname: string, surname: string,
        password: string, phone: string, email: string, positionId: number) => { 
            console.log("Я здесь начал реегать");
    const res = await UserApi.NewRegistration(login, firstname, lastname, surname, password, phone, email, positionId)
    console.log("Я здесь продолжил  регать");
    // const newUser = {
    // key: res.data.id.toString(),
    // fullname: res.data.fullname,
    // email: res.data.email,
    // positionName: res.data.position ? res.data.position.name : 'Не указана',
    // departmentName: res.data.position ? res.data.position.department.name : 'Не указан'
    // };

    //setUsersInfo([...usersInfo, newUser])
    }

    const userStore = useStore(store => store.user)
    
    // состояние отвечающая за регистрацию
    const navigate = useNavigate()

    //получение списка департаментов для поля "Отдела"
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


    //функция регистрации пользователя
    const onFinish = ({login, firstname, lastname, surname, password, phone, email, positionId}:IRegistration) => {
        setLoading(true)
         
        //вывод инфы в консольку
        console.log(login, firstname, lastname, surname, password, phone, email, positionId[1]);

        registration(login, firstname, lastname, surname, password, phone, email, positionId[1]).then(() => {
            setRegFromOpened(false);
            //message.success('Пользователь зарегистрирован!');
            console.log("Я здесь зарегал пользовтеля");
            userStore.login(login, password)
            navigate('/dashboard')
        }).catch(error => {
            if (error.response.data === 'Login already exist') {
                message.warning('Логин уже используется!');
            } else if (error.response.data === 'Position not found') {
                message.error('Должность не найдена!');
            } else {
                message.error('Ошибка регистрации пользователя!');
            }
        }).finally(() => {
            setLoading(false)
        })
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
                                onFieldsChange={onFieldsChange}
                            >
                                <Form.Item name='login' rules={[requiredFormItem]}>
                                    <Input placeholder='Логин' prefix={<IdcardFilled className={style.inputIcon} />}/>
                                </Form.Item>
                                <Form.Item name='email' rules={[requiredFormItem]}>
                                    <Input placeholder='Почта' prefix={<MailFilled className={style.inputIcon} />}/>
                                </Form.Item>
                                <Form.Item name='password' rules={[requiredFormItem]}>
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
                                <Form.Item name='phone' rules={[{ pattern: /^\+7 \d{3} \d{3} \d{2} \d{2}$/,
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