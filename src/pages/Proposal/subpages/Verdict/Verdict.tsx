import {useEffect, useState} from 'react';
import {Card, Col, Divider, Empty, Progress, Row, Skeleton, Spin, Tooltip, Typography} from "antd";
import {observer} from "mobx-react-lite";
import style from "./Verdict.module.scss";
import ProposalDescription from "../../../../components/ProposalDescription/ProposalDescription";
import FinalVerdictForm from "../../../../components/ProposalFinalVerdictForm/FinalVerdictForm";
import { useStore } from '../../../../store';
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography

const Verdict = () => {
    const proposalStore = useStore(store => store.proposal)

    const [percent, setPercent] = useState<number>();
    const [successPercent, setSuccessPercent] = useState<number>();
    const [successNumber, setSuccessNumber] = useState<number>();
    const [rejectNumber, setRejectNumber] = useState<number>();
    const [unwatchNumber, setUnwatchNumber] = useState<number>();
    const [status, setStatus] = useState<"normal" | "active" | "exception" | "success" | undefined>();

    useEffect(() => {
        setSuccessNumber(proposalStore.getExperts().filter(expert => expert.verification_status === 'SUCCESS').length);
        setRejectNumber(proposalStore.getExperts().filter(expert => expert.verification_status === 'REJECT').length);
        setUnwatchNumber(proposalStore.getExperts().filter(expert => expert.verification_status === '').length);

        let successPercent = Math.round(proposalStore.getExperts().filter(expert => expert.verification_status === 'SUCCESS').length * 100 / proposalStore.getExperts().length);

        setPercent(Math.round(proposalStore.getExperts().filter(expert => expert.verification_status !== '').length * 100 / proposalStore.getExperts().length));
        setSuccessPercent(successPercent);

        setStatus(successPercent === 0 ? 'exception' : successPercent === 100 ? 'success' : 'active')
    }, [proposalStore, proposalStore.proposal])

    return (
       <div className={style.verdict}>
           <Spin spinning={!checkStore([proposalStore.proposal])}>
               <Row gutter={[20, 20]}>
                   <Col xs={24} lg={16}>
                       <Card>
                           <Title level={4} style={{marginBottom: '32px'}}>Информация</Title>
                           <ProposalDescription proposal={proposalStore.proposal}/>
                       </Card>
                   </Col>
                   <Col xs={24} lg={8}>
                       <Card>
                           <Row>
                               <Col span={24}>
                                   <Title level={4} style={{marginBottom: '32px'}}>Мнение экспертов</Title>
                                   {
                                       checkStore([proposalStore.proposal])
                                           ? proposalStore.getExperts().length > 0
                                               ?
                                               <div style={{textAlign: "center"}}>
                                                   <Tooltip title={`${successNumber} Согласовали / ${rejectNumber} Отправили на доработку / ${unwatchNumber} Не посмотрели`}>
                                                       <Progress percent={percent}
                                                                 strokeColor={'#f50'}
                                                                 success={{ percent: successPercent, strokeColor: '#87d068' }}
                                                                 status={status}
                                                                 type="dashboard"
                                                                 size={200}/>
                                                   </Tooltip>
                                               </div>
                                               :
                                               <Empty description='Эксперты не назначены'/>
                                           : <Skeleton active/>
                                   }
                               </Col>
                               <Col span={24}>
                                   {
                                       checkStore([proposalStore.proposal])
                                           ? ['DIRECTOR_EVALUATE', 'SUCCESS', 'REJECT', 'ARCHIVED'].includes(proposalStore.proposal.status)
                                               ?
                                                <>
                                                    <Divider style={{height: 'unset'}}/>
                                                    <FinalVerdictForm/>
                                                </>
                                               :
                                               <></>
                                           : <Skeleton active/>
                                   }
                               </Col>
                           </Row>
                       </Card>
                   </Col>
               </Row>
           </Spin>
       </div>
    );
};

export default observer(Verdict);