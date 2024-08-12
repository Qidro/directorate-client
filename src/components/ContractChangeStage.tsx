import {useEffect, useState} from 'react';
import {Button, message, Space, Spin, Typography} from "antd";
import {getContractStage} from "../utils/getContractStage";
import ContractApi from "../api/contract-api";
import CardTitle from "./CardTitle/CardTitle";
import {useStore} from "../store";

const {Title} = Typography;
const stages = ['INITIATION', 'DOC_PREPARED', 'COMPETITIVE_PROCEDURES', 'SIGNING', 'EXECUTED'];

const ContractChangeStage= () => {
    const contractStore = useStore(store => store.contract)
    const [prevStage, setPrevStage] = useState<string>('INITIATION');
    const [nextStage, setNextStage] = useState<string>('INITIATION');
    const [isChanging, setIsChanging] = useState<boolean>(false);

    useEffect(() => {
        setPrevStage(stages[stages.indexOf(contractStore.contract.status) - 1])
        setNextStage(stages[stages.indexOf(contractStore.contract.status) + 1])
    }, [contractStore.contract])

    const changeStatus = async (newStage: string) => {
        setIsChanging(true);

        const type = await contractStore.getDocumentTypeByStage(newStage)
        const isDocument = await contractStore.checkDocument(type)

        if (isDocument || ['INITIATION', 'DOC_PREPARED'].includes(newStage)) {
            try {
                const res = await ContractApi.changeStage(contractStore.contract.id, newStage);
                message.success('Стадия изменена');
                contractStore.setProjectContractInformation(res.data);
            } catch (e) {
                message.error('Ошибка изменения стадии!');
            }
        } else if (type === 'TRADING') message.warning('Для перехода на стадию прикрепите документацию для проведения торгов!')
        else if (type === 'AUCTION') message.warning('Для перехода на стадию прикрепите ссылку на торги!')
        else if (type === 'CONTRACT_DOCUMENTS') message.warning('Для перехода на стадию прикрепите контрактные документы!')

        setIsChanging(false);
    }

    return (
        <Spin spinning={isChanging}>
            <CardTitle>
                <Title level={4}>Изменить стадию контракта</Title>
            </CardTitle>
            <Space>

                {
                    !['INITIATION'].includes(contractStore.contract.status)
                        ? <Button onClick={() => changeStatus(prevStage)}>{getContractStage(prevStage)[0]}</Button>
                        : <></>
                }
                {
                    contractStore.contract.status !== 'EXECUTED'
                        ? <Button type="primary" onClick={() => changeStatus(nextStage)}>{getContractStage(nextStage)[0]}</Button>
                        : <></>
                }
            </Space>
        </Spin>
    );
};

export default ContractChangeStage;