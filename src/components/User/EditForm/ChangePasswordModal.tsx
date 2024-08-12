import {FC} from 'react';
import {Button, Form, Input, Modal} from "antd";

interface IProps {
    open: boolean,
    onClose?: () => void,
    onSubmit?: (password: string) => void,
    loading?: boolean
}

const ChangePasswordModal: FC<IProps> = ({open, onClose, onSubmit, loading}) => {
    const onFinish = (data: {password: string}) => {
        if (onSubmit) onSubmit(data.password)
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title='Смена пароля'
            bodyStyle={{paddingTop: 20}}
            footer={null}
            centered
        >
            <Form
                onFinish={onFinish}
            >
                <Form.Item name='password' rules={[{ required: true }]} hasFeedback>
                    <Input.Password placeholder='Пароль'/>
                </Form.Item>
                <Form.Item
                    name='confirm'
                    hasFeedback
                    rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject();
                            },
                        })
                    ]}
                >
                    <Input.Password placeholder='Подтвердите пароль'/>
                </Form.Item>
                <Form.Item style={{display: 'flex', justifyContent: 'right'}}>
                    <Button type="primary" htmlType="submit" loading={loading}>Сохранить</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangePasswordModal;