import {useRef, useState} from 'react';
import {Card, message, Typography} from "antd";
import CardTitle from "../../../../components/CardTitle/CardTitle";
import ResizableAntdTable from "resizable-antd-table";
import {observer} from "mobx-react-lite";
import {getColumns, ITableDataType} from "./tableData";
import { useStore } from '../../../../store';
import {checkStore} from "../../../../utils/checkStore";

const {Title} = Typography;

const ContractDocuments = () => {
    const fileRef = useRef<HTMLInputElement | null>(null)
    const [fileType, setFileType] = useState<string>('')

    const {
        project: projectStore,
        contract: contractStore
    } = useStore()

    const getDocuments = (type: string) => {
        const documents = contractStore.contract.documents

        if (documents) {
            return documents.filter(item => item.type === type).map(item => ({
                key: item.file_id,
                name: item.filename,
                fileId: item.file_id
            }))
        }

        return []
    }

    const data: ITableDataType[] = [
        {
            key: 1,
            name: 'Без стадии',
            children: [
                {
                    key: 11,
                    name: 'Прочие документы',
                    uploadType: 'OTHER',
                    children: getDocuments('OTHER')
                }
            ]
        },
        {
            key: 2,
            name: 'Готовятся документы',
            children: [
                {
                    key: 21,
                    name: 'Документация для проведения торгов',
                    uploadType: 'TRADING',
                    children: getDocuments('TRADING')
                }
            ]
        },
        {
            key: 3,
            name: 'Проводятся конкурсные процедуры',
            children: [
                {
                    key: 31,
                    name: 'Ссылка на торги',
                    uploadType: 'AUCTION',
                    children: getDocuments('AUCTION')
                }
            ]
        },
        {
            key: 4,
            name: 'Заключается',
            children: [
                {
                    key: 41,
                    name: 'Контрактные документы',
                    uploadType: 'CONTRACT_DOCUMENTS',
                    children: getDocuments('CONTRACT_DOCUMENTS')
                }
            ]
        }
    ]

    const onUploadBtnClick = (type: string) => {
        setFileType(type)
        fileRef.current?.click()
    }

    const onUploadHandler = async (e: any) => {
        message.loading('Загрузка файла')

        const file: File = e.target.files[0]

        try {
            await contractStore.uploadDocument(file, fileType)
            message.destroy();
        } catch (_) {
            message.destroy();
            message.error('Ошибка загрузки файла')
        }
    }

    const onRemoveHandler = async (file_id: string) => {
        message.loading('Удаление файла')
        await contractStore.removeDocument(file_id)
        message.destroy();
    }

    return (
        <Card>
            <CardTitle>
                <Title level={4}>Документы</Title>
            </CardTitle>

            <ResizableAntdTable
                bordered
                loading={!checkStore([contractStore.contract])}
                columns={getColumns(onUploadBtnClick, onRemoveHandler, projectStore.editable)}
                dataSource={data}
                expandable={{indentSize: 20}}
                pagination={false}
                size='small'
            />

            <input type='file' id='file' ref={fileRef} style={{display: 'none'}} onChange={e => onUploadHandler(e)}/>
        </Card>
    );
};

export default observer(ContractDocuments);