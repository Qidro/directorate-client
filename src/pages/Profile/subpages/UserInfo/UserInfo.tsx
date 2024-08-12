import {Card, Col, Form, Row, Tooltip, Typography} from "antd";
import style from './UserInfo.module.scss'
import {observer} from "mobx-react-lite";
import {CheckCircleFilled} from "@ant-design/icons";
import {useStore} from "../../../../store";

const {Title, Text} = Typography

const getItem = (name: string, value: string) => {
    return { name: name, value: value }
}

const UserInfo = () => {
    const userStore = useStore(store => store.user)

    const userInfo = [
        [
            getItem('Полное ФИО', userStore.user.fullname),
            getItem('Фамилия', userStore.user.lastname),
            getItem('Имя', userStore.user.firstname),
            getItem('Отчество', userStore.user.surname),
            getItem('Телефон', userStore.user.phone),
            getItem('Email', userStore.user.email),
        ],
        [
            getItem('Учетная запись', userStore.user.login),
            getItem('Должность', userStore.user.position?.name || 'Не назначена'),
            getItem('Отдел', userStore.user.position?.department.name || '-')
        ]
    ]

    return (
        <div className={style.userInfo}>
            <Row gutter={[20, 20]}>
                <Col xs={24} lg={18}>
                    <Card>
                        <Title level={4}>Общая информация</Title>
                        <Form labelCol={{span: 10}} wrapperCol={{span: 14}} labelAlign='left' colon={false}>
                            <Row>
                                <Col sm={24} lg={12}>
                                    {userInfo[0].map((item, index) => (
                                        <Form.Item
                                            label={<Text type='secondary'>{item.name}</Text>}
                                            key={index}
                                            style={{marginBottom: 0}}
                                        >
                                            {item.value}
                                        </Form.Item>
                                    ))}
                                </Col>
                                <Col sm={24} lg={12}>
                                    {userInfo[1].map((item, index) => (
                                        <Form.Item
                                            label={<Text type='secondary'>{item.name}</Text>}
                                            key={index}
                                            style={{marginBottom: 0}}
                                        >
                                            {item.value}
                                        </Form.Item>
                                    ))}
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
                <Col xs={24} lg={6}>
                    <Card>
                        <Title level={4}>Права</Title>
                        {userStore.user.rights.map(right => (
                            <Tooltip key={right.id} title={right.description}>
                                <div className={style.right}>
                                    <CheckCircleFilled />
                                    <Text>{right.name}</Text>
                                </div>
                            </Tooltip>
                        ))}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default observer(UserInfo);