import style from './ExpertsComments.module.scss'
import {Button, Card, Empty, message, Spin, Table, Tooltip, Typography} from "antd";
import {observer} from "mobx-react-lite";
import {getColumns, ITableDataType} from "./tableData";
import {ProposalComments} from "../../../../types/proposal";
import dayjs from "dayjs";
import {DownloadOutlined} from "@ant-design/icons";
import proposalApi from "../../../../api/proposal-api";
import {saveBlobToFile} from "../../../../utils/saveBlobToFile";
import {useStore} from "../../../../store";
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography

const formatDate = (period: string[]) => {
    if(!period) return undefined
    return dayjs(period[0]).format('DD.MM.YYYY') + '-' + dayjs(period[1]).format('DD.MM.YYYY')
}

const ExpertsComments = () => {
    const {
        user: userStore,
        proposal: proposalStore
    } = useStore()

    const getCommentsRow = (rowName: string, rowData: string, fieldName: keyof ProposalComments): ITableDataType => {
        const data = {
            key: fieldName,
            proposalField: rowName,
            proposalInfo: rowData
        }

        proposalStore.getComments().forEach(comment => {
            Object.assign(data, {[comment.user.id]: comment[fieldName]})
        })

        return data
    }

    const tableData: ITableDataType[] = [
        getCommentsRow('Название проекта', proposalStore.proposal.name, 'name'),
        getCommentsRow('Период реализации', formatDate(proposalStore.proposal.realization_period) || '', 'realization_period'),
        getCommentsRow('Исполнители', proposalStore.proposal.executors, 'executors'),
        getCommentsRow('Обоснование проекта', proposalStore.proposal.justification, 'justification'),
        getCommentsRow('Цель проекта', proposalStore.proposal.purpose, 'purpose'),
        getCommentsRow('Результаты проекта', proposalStore.proposal.results, 'results'),
        getCommentsRow('Целевые показатели проекта', proposalStore.proposal.target_indicators, 'target_indicators'),
        getCommentsRow('Описание планируемых действий', proposalStore.proposal.planned_actions, 'planned_actions'),
        getCommentsRow('Оценочные ресурсы проекта', proposalStore.proposal.resources, 'resources'),
        getCommentsRow('Контакты', proposalStore.proposal.contacts, 'contacts'),
    ]

    const download = async () => {
        message.loading('Выгрузка файла')

        try {
            const res = await proposalApi.downloadWComments(proposalStore.proposal.id)
            saveBlobToFile(res.data, `Проектное предложение. ${proposalStore.proposal.name}.docx`)
        } catch (_) {
            message.error('Ошибка выгрузки документа!')
        }

        message.destroy();
    }

    return (
        <div className={style.comments}>
            <Spin spinning={!checkStore([proposalStore.proposal])}>
                <Card>
                    <div className={style.title}>
                        <Title level={4}>Комментарии</Title>
                        {
                            proposalStore.getComments().length !== 0
                            ?
                                <Tooltip title="Выгрузить комментарии в Word">
                                    <Button type='dashed' icon={<DownloadOutlined/>} onClick={download}></Button>
                                </Tooltip>
                            :
                                <></>
                        }

                    </div>

                    {proposalStore.getExperts().length === 0
                        ? <Empty description='Эксперты не назначены'/>
                        :
                        proposalStore.getExperts().find(expert => expert.user.id === userStore.user.id)
                        && !userStore.checkRight('DIRECTOR-EX')
                        && proposalStore.proposal.status !== 'SUCCESS'
                            ? (
                                <Empty description='Руководитель еще не вынес заключение'/>
                            ) : (
                                <Table
                                    bordered
                                    pagination={false}
                                    columns={getColumns(proposalStore.getExperts(), !userStore.checkRight('DIRECTOR-EX'))}
                                    dataSource={tableData}
                                    scroll={{x: 800}}
                                />
                            )
                    }
                </Card>
            </Spin>
        </div>
    );
};

export default observer(ExpertsComments);