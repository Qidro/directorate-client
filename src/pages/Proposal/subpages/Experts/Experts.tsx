import {useEffect, useState} from 'react';
import {Button, Card, message, Modal, Select, Table, Tag} from "antd";
import {observer} from "mobx-react-lite";
import {ExpertTable, getColumns} from "./tableData";
import ProposalApi from "../../../../api/proposal-api";
import {getExpertStatus} from "../../../../utils/getExpertStatus";
import dayjs from "dayjs";
import {useStore} from "../../../../store";
import {checkStore} from "../../../../utils/checkStore";

interface Options {
    value: number,
    label: string
}

const Experts = () => {
    const proposalStore = useStore(store => store.proposal)

    const loading = !checkStore([proposalStore.proposal])
    const [expertsInfo, setExpertsInfo] = useState<ExpertTable[]>();
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [options, setOptions] = useState<Options[]>();

    const modalHandler = async (state: boolean) => {
        setModalOpen(state)

        if (state) {
            message.loading('Загрузка данных');
            const res = await ProposalApi.getExperts(proposalStore.proposal.id)
            message.destroy();

            const data = res.data.map(expert => ({
                value: expert.id,
                label: `${expert.fullname} | ${expert.position.department.name} | ${expert.position.name}`
            }))

            setOptions(data);
        }
    }

    useEffect(() => {
        const data = proposalStore.getExperts().map((expert) => {
            const status = getExpertStatus(expert.verification_status)

            return {
                key: expert.user.id,
                fullname: expert.user.fullname,
                date_appointment: dayjs(expert.date_appointment).format('DD.MM.YYYY'),
                status: <Tag color={'#' + status[1]}>{status[0]}</Tag>,
                date: dayjs(expert.date_verification).isValid() ? dayjs(expert.date_verification).format('DD.MM.YYYY') : ''
            }
        });

        setExpertsInfo(data)
    }, [proposalStore, proposalStore.proposal.experts])

    const removeExpert = async (userId: number) => {
        message.loading('Удаление эксперта')
        await proposalStore.removeExpert(userId)
        message.destroy()

        setExpertsInfo(expertsInfo?.filter(expert => expert.key !== userId))
        message.success('Эксперт удален')
    }

    const addExpert = async (userId: number) => {
        message.loading('Добавление эксперта')
        const res = await proposalStore.addExpert(userId)
        message.destroy()

        setOptions(options?.filter(option => option.value !== res.data.user.id))
        setModalOpen(false)
    }

    return (
        <Card style={{textAlign: 'right'}}>
            {
                proposalStore.proposal.status !== 'SUCCESS' && !loading
                    ? <Button type='primary' style={{marginBottom: 22}} onClick={() => modalHandler(true)}>Назначить эксперта</Button>
                    : <></>
            }

            <Table
                columns={
                    proposalStore.proposal.status === 'SUCCESS'
                        ? getColumns(removeExpert).filter(column => column.key !== 'action')
                        : getColumns(removeExpert)
                }
                dataSource={expertsInfo}
                bordered
                loading={loading}
                scroll={{x: 800}}
            />

            <Modal
                destroyOnClose
                width='40vw'
                title="Назначение эксперта"
                open={modalOpen}
                onCancel={() => modalHandler(false)}
                footer={null}
            >
                <Select
                    showSearch
                    placeholder="Выберите эксперта"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={options}
                    style={{width: '100%', marginTop: "20px"}}
                    onSelect={(value) => addExpert(value)}
                />
            </Modal>
        </Card>
    );
};

export default observer(Experts);