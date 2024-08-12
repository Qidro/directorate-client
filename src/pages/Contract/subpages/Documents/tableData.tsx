import {ColumnsType} from "antd/es/table";
import {Button, Popconfirm} from "antd";
import {DeleteOutlined, UploadOutlined} from "@ant-design/icons";
import FileApi from "../../../../api/file-api";
import React from "react";

export interface ITableDataType {
    key: number | string,
    name: string,
    uploadType?: string,
    fileId?: string,
    children?: ITableDataType[]
}

export const getColumns = (
    onUpload: (type: string) => void,
    onRemove: (fileId: string) => void,
    projectEditable: boolean
) => {
    return [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Название',
            render: (value, record) => {
                if (record.fileId) {
                    return <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <a href={FileApi.getFileLink(record.fileId)} download>{value}</a>
                        {
                            projectEditable &&
                            <Popconfirm
                                title="Удаление документа"
                                description="Вы уверены, что хотите удалить документ?"
                                okText="Да"
                                cancelText="Нет"
                                onConfirm={() => onRemove(record.fileId!)}
                            >
                                <Button danger size='small' type='text' style={{marginLeft: 10}} icon={<DeleteOutlined/>}></Button>
                            </Popconfirm>
                        }
                    </div>
                }

                if (record.uploadType && projectEditable) {
                    return <>
                        {value}
                        <Button
                            icon={<UploadOutlined />}
                            size='small'
                            style={{marginLeft: 10}}
                            onClick={() => onUpload(record.uploadType!)}
                            type='dashed'
                        ></Button>
                    </>
                }

                return value
            }
        }
    ] as ColumnsType<ITableDataType>
}