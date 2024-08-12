import {useEffect, useState} from 'react';
import style from './Backpacks.module.scss'
import {Button, Card, Select, Table, Typography} from "antd";
import {IBackpack} from "../../types/backpack";
import BackpackApi from "../../api/backpack-api";
import {columns, ITableDataType} from './tableData';
import dayjs from "dayjs";
import BackpackModal from "../../components/BackpackModal/BackpackModal";
import {IBackpackForm} from "../../types/forms";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import {useNavigate} from "react-router-dom";
import {useStore} from "../../store";

const {Title} = Typography

const tableFilters = [
    {
        label: 'Все портфели',
        value: 'all',
    },
    {
        label: 'Мои портфели',
        value: 'my',
    }
]

const backpacksToTable = (backpacks: IBackpack[]): ITableDataType[] => {
    return backpacks.map(item => {
        return {
            key: item.id,
            name: `№${item.id} ${item.name}`,
            creationDate: dayjs(item.creation_date).format('DD.MM.YYYY'),
            leader: item.users.find(user => user.role.slug === 'SUPERVISOR'),
            admins: item.users.filter(user => user.role.slug === 'ADMINISTRATOR')
        }
    })
}

const Backpacks = () => {
    useDocumentTitle('Портфели')

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [backpackLoading, setBackpackLoading] = useState<boolean>(true)
    const [createLoading, setCreateLoading] = useState<boolean>(false)
    const [tableData, setTableData] = useState<ITableDataType[]>([])

    const {
        user: userStore
    } = useStore()

    useEffect(() => {
        setBackpackLoading(true)
        BackpackApi.getAllBackpacks().then(res => {
            setTableData(backpacksToTable(res.data))
        }).finally(() => setBackpackLoading(false))
    }, [])

    const onFilterChangeHandler = async (value: any) => {
        setBackpackLoading(true)

        let backpacks: IBackpack[] = []

        switch (value) {
            case 'my':
                backpacks = (await BackpackApi.getMyBackpacks()).data
                break
            case 'all':
                backpacks = (await BackpackApi.getAllBackpacks()).data
                break
        }

        setTableData(backpacksToTable(backpacks))
        setBackpackLoading(false)
    }

    const modalOpenHandler = () => setIsModalOpen(prev => !prev)

    const newBackpackHandler = async (data: IBackpackForm) => {
        setCreateLoading(true)

        const res = await BackpackApi.create(
            data.name,
            data.description
        )

        setTableData(prev => [...prev, ...backpacksToTable([res.data])])

        setCreateLoading(false)
        modalOpenHandler()
    }

    return (
        <div className={style.backpacks}>
            <Card>
                <div className={style.title}>
                    <Title level={4}>Портфели</Title>

                    <div className={style.actions}>
                        <Select options={tableFilters} size='middle' defaultValue='all' onChange={onFilterChangeHandler} style={{marginBottom: 20}}/>

                        {
                            userStore.checkRight('DIRECTOR-EX') &&
                            <Button
                                type='primary'
                                onClick={modalOpenHandler}
                            >Создать портфель</Button>
                        }

                    </div>
                </div>

                <Table
                    bordered
                    columns={columns}
                    dataSource={tableData}
                    loading={backpackLoading}
                    scroll={{x: 1000}}
                    onRow={record => {
                        return {
                            onClick: () => navigate('/backpack/'+record.key+'/info')
                        }
                    }}
                    pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
                    rowClassName='tableRow'
                />

                <BackpackModal open={isModalOpen} onClose={modalOpenHandler} onSubmit={newBackpackHandler} loading={createLoading}/>
            </Card>
        </div>
    );
};

export default Backpacks;