import React, {useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Card, message, Space, Tooltip, Typography} from "antd";
import CardTitle from "../../../../components/CardTitle/CardTitle";
import {getColumns, ITableDataType} from "../../../Contract/subpages/Documents/tableData";
import ResizableAntdTable from "resizable-antd-table";
import { useStore } from '../../../../store';
import {checkStore} from "../../../../utils/checkStore";
import {DownloadOutlined} from "@ant-design/icons";
import ProjectApi from "../../../../api/project-api";
import {saveBlobToFile} from "../../../../utils/saveBlobToFile";

const {Title} = Typography;

const Documents = () => {
    const fileRef = useRef<HTMLInputElement | null>(null)
    const [fileType, setFileType] = useState<string>('')

    const projectStore = useStore(store => store.project)

    const getDocuments = (type: string) => {
        const documents = projectStore.project.documents

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
            name: 'Инициирование',
            children: [
                {
                    key: 21,
                    name: 'Обоснование паспорта проекта',
                    uploadType: 'JUSTIFICATION',
                    children: getDocuments('JUSTIFICATION')
                },
                {
                    key: 22,
                    name: 'Паспорт проекта',
                    uploadType: 'PASSPORT',
                    children: getDocuments('PASSPORT')
                },
            ]
        },
        {
            key: 3,
            name: 'Подготовка',
            children: [
                {
                    key: 31,
                    name: 'Сводный план проекта',
                    uploadType: 'PLAN',
                    children: getDocuments('PLAN')
                }
            ]
        },
        {
            key: 4,
            name: 'Реализация',
            children: [
                {
                    key: 41,
                    name: 'Рабочий план проекта',
                    uploadType: 'WORK_PLAN',
                    children: getDocuments('WORK_PLAN')
                },
                {
                    key: 42,
                    name: 'Акты приемки выполненных работ',
                    uploadType: 'ACCEPTANCE_ACTS',
                    children: getDocuments('ACCEPTANCE_ACTS')
                },
            ],
        },
        {
            key: 5,
            name: 'Завершение',
            children: [
                {
                    key: 51,
                    name: 'Итоговый отчет о реализации проекта',
                    uploadType: 'FINAL_REPORT',
                    children: getDocuments('FINAL_REPORT')
                },
                {
                    key: 52,
                    name: 'План достижения результатов и выгод на период после завершения проекта',
                    uploadType: 'ACHIEVEMENT_PLAN',
                    children: getDocuments('ACHIEVEMENT_PLAN')
                },
            ],
        },
        {
            key: 6,
            name: 'Постпроектный мониторинг',
            children: [
                {
                    key: 61,
                    name: 'Документы стадии',
                    uploadType: 'STAGE_DOCUMENTS',
                    children: getDocuments('STAGE_DOCUMENTS')
                },
            ],
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
            await projectStore.uploadDocument(file, fileType)
            message.destroy();
        } catch (_) {
            message.destroy();
            message.error('Ошибка загрузки файла')
        }
    }

    const onRemoveHandler = async (file_id: string) => {
        message.loading('Удаление файла')
        await projectStore.removeDocument(file_id)
        message.destroy();
    }

    const downloadPassport = async () => {
        message.loading('Выгрузка файла')

        try {
            const res = await ProjectApi.downloadPassport(projectStore.project.id)
            saveBlobToFile(res.data, `Паспорт проекта. ${projectStore.project.name}.docx`)
        } catch (_) {
            message.error('Ошибка выгрузки документа!')
        }

        message.destroy();
    }

    const downloadPlan = async () => {
        message.loading('Выгрузка файла')

        try {
            const res = await ProjectApi.downloadPlan(projectStore.project.id)
            saveBlobToFile(res.data, `Сводный план проекта. ${projectStore.project.name}.docx`)
        } catch (_) {
            message.error('Ошибка выгрузки документа!')
        }

        message.destroy();
    }

    return (
        <Card>
            <CardTitle wrap={false}>
                <Title level={4}>Документы</Title>

                <Space size='small'>
                    <Tooltip title="Скачать паспорт проекта">
                        <Button type='dashed' icon={<DownloadOutlined/>} onClick={downloadPassport}></Button>
                    </Tooltip>

                    <Tooltip title="Скачать сводный план проекта">
                        <Button type='dashed' icon={<DownloadOutlined/>} onClick={downloadPlan}></Button>
                    </Tooltip>
                </Space>
            </CardTitle>

            <ResizableAntdTable
                bordered
                loading={!checkStore([projectStore.project])}
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

export default observer(Documents);