import {CSSProperties, FC} from 'react';
import {IProposalDescriptionProps} from "./IProposalDescriptionProps";
import {Descriptions} from "antd";
import dayjs from "dayjs";

const itemStyle: CSSProperties = {display: 'inline-block', maxHeight: 200, overflowY: 'auto', whiteSpace: 'pre-line'}

const ProposalDescription: FC<IProposalDescriptionProps> = ({proposal}) => {
    return (
        <Descriptions column={1} bordered>
            <Descriptions.Item label='Название проекта' contentStyle={itemStyle}>
                {proposal?.name}
            </Descriptions.Item>
            <Descriptions.Item label='Период реализации' contentStyle={itemStyle}>
                {
                     proposal?.realization_period && typeof proposal?.realization_period === 'object'
                        ? (
                            dayjs(proposal?.realization_period[0]).format('DD.MM.YYYY') + ' - ' +
                            dayjs(proposal?.realization_period[1]).format('DD.MM.YYYY')
                        ) : (
                            proposal?.realization_period
                        )
                }
            </Descriptions.Item>
            <Descriptions.Item label='Исполнители' contentStyle={itemStyle}>
                {proposal?.executors}
            </Descriptions.Item>
            <Descriptions.Item label='Обоснование проекта' contentStyle={itemStyle}>
                {proposal?.justification}
            </Descriptions.Item>
            <Descriptions.Item label='Цель проекта' contentStyle={itemStyle}>
                {proposal?.purpose}
            </Descriptions.Item>
            <Descriptions.Item label='Результаты проекта' contentStyle={itemStyle}>
                {proposal?.results}
            </Descriptions.Item>
            <Descriptions.Item label='Целевые показатели проекта' contentStyle={itemStyle}>
                {proposal?.target_indicators}
            </Descriptions.Item>
            <Descriptions.Item label='Описание планируемых действий' contentStyle={itemStyle}>
                {proposal?.planned_actions}
            </Descriptions.Item>
            <Descriptions.Item label='Оценочные ресурсы проекта' contentStyle={itemStyle}>
                {proposal?.resources}
            </Descriptions.Item>
            <Descriptions.Item label='Контакты' contentStyle={itemStyle}>
                {proposal?.contacts}
            </Descriptions.Item>
        </Descriptions>
    );
};

export default ProposalDescription;