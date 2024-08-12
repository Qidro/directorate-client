import {useEffect, useState} from 'react';
import {Button, Form, Input, message, Typography} from "antd";
import {observer} from "mobx-react-lite";
import {useForm} from "antd/es/form/Form";
import ProposalApi from "../../api/proposal-api";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import ConvertToProjectModal from "../ConvertToProjectModal/ConvertToProjectModal";
import {IConvertToProjectForm} from "../../types/forms";
import proposalApi from "../../api/proposal-api";
import ConversionResultModal from "../ConversionResultModal/ConversionResultModal";
import {useStore} from "../../store";

const { Title, Text } = Typography;
const { TextArea } = Input;

const requiredFormItem = {
    required: true,
    message: ''
}

interface IFinalVerdict {
    conclusion: string
}

const FinalVerdictForm = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [fieldsDisabled, setFieldsDisabled] = useState<boolean>(false);
    const [isConvertToProjectOpen, setConvertToProjectOpen] = useState<boolean>(false);
    const [isConversionResultOpen, setConversionResultOpen] = useState<boolean>(false);

    const {
        project: projectStore,
        proposal: proposalStore,
        user: userStore
    } = useStore()

    const [status, setStatus] = useState<'SUCCESS' | 'REJECT' | 'ARCHIVED'>('SUCCESS');

    const navigate = useNavigate();
    const [form] = useForm();

    const onFinish = (data: IFinalVerdict) => {
        setLoading(true);
        ProposalApi.setVerdict(proposalStore.proposal.id, data.conclusion, status).then(() => {
            message.success('Заключение сохранено');
            proposalStore.proposal.status = status;
            setFieldsDisabled(true);
        }).catch(error => {
            if (error.response.data === 'Proposal not found') {
                message.error('Проектное предложение не найдено!')
                navigate('/proposals')
            } else if (error.response.data === 'Verdict not found') {
                message.error('Не известный статус заключения!')
            } else message.error('Ошибка сохранения заключения!')
        }).finally(() => {
            setLoading(false);
        })
    };

    const convertToProject = ({backpackId, userId, userCuratorId}: IConvertToProjectForm) => {
        setLoading(true);
        proposalApi.convertToProject(proposalStore.proposal.id, backpackId, userId, userCuratorId).then((res) => {
            projectStore.setProjectInformation(res.data);
            convertToProjectModalHandler();
            setConversionResultOpen(true);
        }).catch((error) => {
            if (error.response.data === 'Proposal not found') {
                message.error('Проектное предложение не найдено!');
                navigate('/proposals')
            } else if (error.response.data === 'Backpack not found') message.error('Портфель не найден!');
            else if (error.response.data === 'Proposal no status success') message.warning('Проектное предложение не имеет статус "Согласовано"!');
            else if (error.response.data === 'User not found') message.error('Пользователь не найден!');
            else message.error('Ошибка преобразования!');
        }).finally(() => {
            setLoading(false);
        });
    }

    const convertToProjectModalHandler = () => setConvertToProjectOpen(prev => !prev);

    const conversionResultModalHandler = () => {
        navigate('/proposals');
    };

    useEffect(() => {
        if (['SUCCESS', 'REJECT'].includes(proposalStore.proposal.status) || !userStore.checkRight('DIRECTOR-EX')) setFieldsDisabled(true);
        form.setFieldsValue(proposalStore.proposal.verdict);
}, [proposalStore, userStore, form]);

    return (
        <>
            <Title level={4}>Заключение</Title>
            <Form
                onFinish={onFinish}
                initialValues={proposalStore.proposal.verdict}
                form={form}
            >
                <Form.Item name='conclusion' rules={[requiredFormItem]}>
                    <TextArea disabled={fieldsDisabled}/>
                </Form.Item>
                {
                    userStore.checkRight('DIRECTOR-EX') ?
                        ['SUCCESS'].includes(proposalStore.proposal.status )
                            ?
                            <Form.Item>
                                    <Button
                                        type='primary'
                                        loading={loading}
                                        onClick={convertToProjectModalHandler}
                                        style={{width: '100%'}}
                                    >Преобразовать в проект</Button>
                                    <Button
                                        htmlType='submit'
                                        loading={loading}
                                        onClick={() => setStatus('REJECT')}
                                        style={{width: '100%', margin: '10px 0'}}
                                    >Отправить на доработку</Button>
                                    <Button
                                        htmlType='submit'
                                        loading={loading}
                                        type='dashed'
                                        onClick={() => setStatus('ARCHIVED')}
                                        style={{width: '100%'}}
                                    >Отклонить</Button>
                            </Form.Item>
                            :
                            <Form.Item>
                                <Button
                                    htmlType='submit'
                                    type='primary'
                                    loading={loading}
                                    onClick={() => setStatus('SUCCESS')}
                                    disabled={fieldsDisabled}
                                    style={{width: '100%'}}
                                >Согласовать</Button>
                                <Button
                                    htmlType='submit'
                                    loading={loading}
                                    onClick={() => setStatus('REJECT')}
                                    disabled={fieldsDisabled}
                                    style={{width: '100%', margin: '10px 0'}}
                                >Отправить на доработку</Button>
                            </Form.Item>
                        : <></>
                }
            </Form>
            {
                ['SUCCESS', 'REJECT', 'ARCHIVED'].includes(proposalStore.proposal.status)
                    ?
                    <Text type='secondary'>
                        Заключение вынесено: {dayjs(proposalStore.proposal.verdict?.date).format('DD.MM.YYYY') }
                    </Text>
                    :
                    <></>
            }
            {
                ['SUCCESS'].includes(proposalStore.proposal.status)
                    ?
                    <>
                        <ConvertToProjectModal open={isConvertToProjectOpen} onClose={convertToProjectModalHandler} loading={loading}
                                               onSubmit={convertToProject} submitText='Преобразовать'/>
                        <ConversionResultModal open={isConversionResultOpen} onClose={conversionResultModalHandler}/>
                    </>
                    :
                    <></>
            }
        </>
    );
};

export default observer(FinalVerdictForm);