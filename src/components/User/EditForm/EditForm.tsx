import React, {useEffect, useState} from 'react';
import {Form, Input, Cascader, Button, Row, Col, Descriptions, Spin} from 'antd';
import OrgStructureApi from "../../../api/orgStructure-api";
import {IUser} from "../../../types/user";
import style from './EditForm.module.scss'
import {IRight} from "../../../types/right";
import RightApi from "../../../api/right-api";
import {useForm} from "antd/es/form/Form";
import MySwitch from "./Switch";
import {IUserEditForm} from "../../../types/forms";
import ChangePasswordModal from "./ChangePasswordModal";
import {useLogs} from "../../../hooks/useLogs";
import LogsApi from "../../../api/logs-api";
import LogsModal from "../../LogsModal/LogsModal";

interface Options {
    value: number,
    label: string,
    children? : Options[]
}

type Props = {
    userInfo: IUser,
    onUserFormSubmit?: (data: IUserEditForm) => void,
    onPasswordChange?: (newPassword: string) => void,
    loading?: boolean
}

const rightsStyle = {
    contentStyle: {justifyContent: 'end'},
    labelStyle: {color: 'rgba(0, 0, 0, 0.88)'},
    colon: false,
    column: 1,
}

const EditForm = ({userInfo, loading, onUserFormSubmit, onPasswordChange}: Props) => {
    const [options, setOptions] = useState<Options[]>([]);
    const [rights, setRights] = useState<IRight[]>([]);
    const [form] = useForm();

    const [logsOpen, setLogsOpen] = useState<boolean>(false)
    const [logs, loadLogs, logsLoading] = useLogs(LogsApi.getUserLogs, userInfo.id)

    const [passModalOpen, setPassModalOpen] = useState<boolean>(false)

    const onFinish = (data: IUserEditForm) => {
        if (onUserFormSubmit) onUserFormSubmit(data)
    }

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

    const getRights = async () => {
        const res = await RightApi.getRights();
        setRights(res.data)
    }

    useEffect(() => {
        form.setFieldsValue({
            ...userInfo,
            positionId: [userInfo ? userInfo.position.department.id : '', userInfo ? userInfo.position.id : '']
        })
        getOptionsData().then();
        getRights().then();
    }, [form, userInfo]);

    const passwordChange = async (password: string) => {
        if (onPasswordChange) {
            await onPasswordChange(password)
            setPassModalOpen(false)
        }
    }

    return (
        <>
            <Form
                labelCol={{span: 10}}
                wrapperCol={{span: 14}}
                labelAlign='left'
                onFinish={onFinish}
                initialValues={userInfo}
                form={form}
                colon={false}
            >
                <Row gutter={50}>
                    <Col xs={24} sm={12}>
                        <Form.Item label="Фамилия" name='lastname' rules={[{ required: true }]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Имя" name='firstname' rules={[{ required: true }]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Отчество" name='surname' rules={[{ required: true }]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Отдел / Должность" name='positionId' rules={[{ required: true }]}>
                            <Cascader options={options} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item label="Логин" name='login' rules={[{ required: true }]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Почта" name='email' rules={[{ required: true, type: 'email' }]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Пароль">
                            <Button block type='dashed' onClick={() => setPassModalOpen(true)}>Сменить пароль</Button>
                        </Form.Item>
                        <Form.Item label="Действия">
                            <Button block type='dashed' onClick={() => setLogsOpen(true)}>Журнал действий</Button>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item style={{display: 'flex', justifyContent: 'right'}}>
                    <Button type="primary" htmlType="submit" loading={loading}>Сохранить</Button>
                </Form.Item>
            </Form>

            <div className={style.right__title}>Права</div>
            {rights.length === 0 ? (
                <div className={style.spinner}>
                    <Spin style={{textAlign: 'center'}}/>
                </div>
            ) : (
                <Row gutter={[35, 0]}>
                    <Col xs={24} sm={12}>
                        <Descriptions {...rightsStyle}>
                            {rights.slice(0, Math.ceil(rights.length / 2)).map((right, key) => (
                                <Descriptions.Item label={right.name} key={key}>
                                    <MySwitch userInfo={userInfo} right={right}></MySwitch>
                                </Descriptions.Item>
                            ))}
                        </Descriptions>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Descriptions {...rightsStyle}>
                            {rights.slice(Math.ceil(rights.length / 2)).map((right, key) => (
                                <Descriptions.Item label={right.name} key={key}>
                                    <MySwitch userInfo={userInfo} right={right}></MySwitch>
                                </Descriptions.Item>
                            ))}
                        </Descriptions>
                    </Col>
                </Row>
            )}
            
            <ChangePasswordModal
                open={passModalOpen}
                onClose={() => setPassModalOpen(false)}
                onSubmit={passwordChange}
                loading={loading}
            />

            <LogsModal
                open={logsOpen}
                logs={logs}
                onClose={() => setLogsOpen(false)}
                onScrolledToEnd={loadLogs}
                loading={logsLoading}
            />
        </>
    );
};

export default EditForm;