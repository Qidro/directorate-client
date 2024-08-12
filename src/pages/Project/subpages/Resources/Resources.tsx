import {observer} from "mobx-react-lite";
import {Card, message, Table, Typography} from "antd";
import {getColumnsCP, getColumnsWorking} from "./tableData";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {IResourceCP, IResourceWorking} from "../../../../types/resource";
import ResosurcesApi from "../../../../api/resosurces-api";
import CardTitle from "../../../../components/CardTitle/CardTitle";

const {Title} = Typography;

const Resources = () => {
    const {projectId} = useParams();

    const [tableDataWorking, setTableDataWorking] = useState<IResourceWorking[]>();
    const [tableDataCP, setTableDataCP] = useState<IResourceCP[]>();
    const [resourcesLoading, setResourcesLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setResourcesLoading(true)
            try {
                const resWorking = await ResosurcesApi.getResourceWorking(projectId!);
                const resCP = await ResosurcesApi.getResourceCP(projectId!);
                setTableDataWorking(resWorking.data);
                setTableDataCP(resCP.data);
            } catch (e) {
                message.error('Ошибка загрузки данных');
            }
            setResourcesLoading(false)
        }

        fetchData().then();
    }, [projectId])

    return (
        <Card>
            <CardTitle>
                <Title level={4}>Ресурсы проекта</Title>
            </CardTitle>


            <Title level={5}>Состав рабочих органов проекта</Title>
            <Table
                columns={getColumnsWorking()}
                bordered
                dataSource={tableDataWorking}
                loading={resourcesLoading}
                scroll={{x: 1200}}
                pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
                rowClassName='tableRow'
            />

            <Title level={5} style={{marginTop: 40}}>Ресурсный план</Title>
            <Table
                columns={getColumnsCP()}
                bordered
                dataSource={tableDataCP}
                loading={resourcesLoading}
                scroll={{x: 1200}}
                pagination={{showSizeChanger: true, position: ['topRight', 'bottomRight']}}
                rowClassName='tableRow'
            />
        </Card>
    );
};

export default observer(Resources);