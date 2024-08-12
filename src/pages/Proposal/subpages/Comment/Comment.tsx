import {useEffect, useState} from 'react';
import style from './Comment.module.scss'
import {Button, Card, Form, message, Spin, Table, Typography} from "antd";
import {IProposalForm} from "../../../../types/forms";
import RouterPrompt from "../../../../components/RouterPrompt/RouterPrompt";
import {CommentTable, getColumns} from './tableData';
import {ProposalComments} from '../../../../types/proposal';
import dayjs from 'dayjs';
import {useForm} from "antd/es/form/Form";
import {useStore} from "../../../../store";
import {observer} from "mobx-react-lite";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography

const getCommentRow = (rowName: string, rowData: string, fieldName: keyof ProposalComments): CommentTable => {
    return {
        key: fieldName,
        rowName: rowName,
        rowData: rowData
    }
}

const formatDate = (period: string[]) => {
    if(!period) return undefined
    return dayjs(period[0]).format('DD.MM.YYYY') + '-' + dayjs(period[1]).format('DD.MM.YYYY')
}

const Comment = () => {
    const {
        user: userStore,
        proposal: proposalStore
    } = useStore()

    const [form] = useForm()
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<'SUCCESS' | 'REJECT'>('SUCCESS')
    const [comment, setComment] = useState<ProposalComments>()

    useEffect(() => {
        setComment(proposalStore.getUserComment(userStore.user.id))
    }, [proposalStore, userStore.user.id, proposalStore.proposal])

    useEffect(() => {
        form.setFieldsValue(comment)
    }, [form, comment])

    const tableData: CommentTable[] = [
        getCommentRow('Название проекта', proposalStore.proposal.name, 'name'),
        getCommentRow('Период реализации', formatDate(proposalStore.proposal.realization_period) || '', 'realization_period'),
        getCommentRow('Исполнители', proposalStore.proposal.executors, 'executors'),
        getCommentRow('Обоснование проекта', proposalStore.proposal.justification, 'justification'),
        getCommentRow('Цель проекта', proposalStore.proposal.purpose, 'purpose'),
        getCommentRow('Результаты проекта', proposalStore.proposal.results, 'results'),
        getCommentRow('Целевые показатели проекта', proposalStore.proposal.target_indicators, 'target_indicators'),
        getCommentRow('Описание планируемых действий', proposalStore.proposal.planned_actions, 'planned_actions'),
        getCommentRow('Оценочные ресурсы проекта', proposalStore.proposal.resources, 'resources'),
        getCommentRow('Контакты', proposalStore.proposal.contacts, 'contacts'),
    ]

    const checkExistMyVerdict = () => {
        const expert = proposalStore.getExperts().find(item => item.user.id === userStore.user.id)
        return expert?.verification_status !== ''
    }

    const isEdit = proposalStore.proposal.status === 'EXPERTS_EVALUATE' && !checkExistMyVerdict()

    const onSubmit = async (values: IProposalForm) => {
        setLoading(true)
        await proposalStore.sendComment(values, status, userStore.user.id)
        setLoading(false)
        message.success('Комментарий сохранен')
    }

    return (
        <RouterPrompt blocked={isEdit}>
            <div className={style.comment}>
                <Spin spinning={!checkStore([proposalStore.proposal])}>
                    <Card>
                        <div className={style.title}>
                            <Title level={4}>Ваш комментарий</Title>
                        </div>

                        <Form onFinish={onSubmit} form={form} disabled={!isEdit}>
                            <Table
                                columns={getColumns()}
                                dataSource={tableData}
                                bordered
                                pagination={false}
                                scroll={{x: 800}}
                            />
                            {isEdit && (
                                <Form.Item>
                                    <div className={style.formActions}>
                                        <Button htmlType='submit' loading={loading} onClick={() => setStatus('REJECT')}>Отправить на доработку</Button>
                                        <Button htmlType='submit' loading={loading} onClick={() => setStatus('SUCCESS')} type='primary'>Согласовать</Button>
                                    </div>
                                </Form.Item>
                            )}
                        </Form>
                    </Card>
                </Spin>
            </div>
        </RouterPrompt>
    );
};

export default observer(Comment);