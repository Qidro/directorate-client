import style from './ProposalInfo.module.scss'
import {Button, Card, Col, Progress, Row, Spin, Typography} from "antd";
import {observer} from "mobx-react-lite";
import ProposalDescription from "../../../../components/ProposalDescription/ProposalDescription";
import {checkExpert} from "../../../../utils/checkExpert";
import { useStore } from '../../../../store';
import {checkStore} from "../../../../utils/checkStore";

const {Title, Text} = Typography

const ProposalInfo = () => {
    const {
        user: userStore,
        proposal: proposalStore
    } = useStore()

    const expertInfoAccess = () => {
        return userStore.checkRight('DIRECTOR-EX') || checkExpert(proposalStore.proposal.experts || [], userStore.user.id)
    }

    const checkedExpertsCount = () => {
        return proposalStore.proposal.experts?.filter(expert => expert.verification_status !== '').length || 0
    }

    return (
        <div className={style.info}>
            <Spin spinning={!checkStore([proposalStore.proposal])}>
                <Row gutter={[20, 20]}>
                    <Col xs={24} lg={expertInfoAccess() ? 16 : 24}>
                        <Card>
                            <div className={style.title}>
                                <Title level={4}>Информация</Title>
                                {proposalStore.proposal.status === 'REJECT' && proposalStore.proposal.user.id === userStore.user.id ? <>
                                <Button type='primary' onClick={() => proposalStore.setEditOpen(true)}>Редактировать</Button>
                                </> : <></>}
                            </div>

                            <ProposalDescription proposal={proposalStore.proposal}/>
                        </Card>
                    </Col>
                    {expertInfoAccess() ? <>
                        <Col xs={24} lg={8}>
                            <Card>
                                <div className={style.title}>
                                    <Title level={4}>Эксперты</Title>
                                </div>

                                <div className={style.charts}>
                                    <div className={style.progress}>
                                        <Progress
                                            type='dashboard'
                                            percent={(100 / proposalStore.getExperts().length) * proposalStore.getExperts().length}
                                            format={() => <div style={{color: 'black'}}>{proposalStore.getExperts().length}</div>}
                                            strokeColor='#e63636'
                                            size='default'
                                        />
                                        <Text>Назначенные эксперты</Text>
                                    </div>
                                    <div className={style.progress}>
                                        <Progress
                                            type='dashboard'
                                            percent={(100 / proposalStore.getExperts().length) * checkedExpertsCount()}
                                            format={() => <div style={{color: 'black'}}>{checkedExpertsCount()}</div>}
                                            strokeColor='#e63636'
                                            size='default'
                                        />
                                        <Text>Проверившие эксперты</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </> : <></>}
                </Row>
            </Spin>
        </div>
    );
};

export default observer(ProposalInfo);