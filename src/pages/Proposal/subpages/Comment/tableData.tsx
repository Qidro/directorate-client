import {Form, Input} from "antd";
import { ColumnsType } from "antd/es/table";
import { CSSProperties } from "react";
import style from './Comment.module.scss'

export interface CommentTable {
    key: string;
    rowName: string;
    rowData: string;
}

const requiredFormItem = {
    required: true,
    message: ''
}

const cellStyle: CSSProperties = {
    minHeight: 70,
    maxHeight: 200,
    display: 'inline-block',
    overflowY: 'auto',
    margin: -16,
    padding: 16,
    whiteSpace: 'pre-line'
}

export const getColumns = () => {
    return [
        {
            key: 'rowName',
            dataIndex: 'rowName',
            rowScope: 'row',
            width: '20%'
        },
        {
            key: 'rowData',
            dataIndex: 'rowData',
            width: '40%',
            render: (item) => (
                <div style={cellStyle}>{item}</div>
            )
        },
        {
            title: 'Ваш комментарий',
            key: 'comment',
            width: '40%',
            render: (_, record) => (
                <Form.Item name={record.key} rules={[requiredFormItem]} className={style.formItem}>
                    <Input.TextArea />
                </Form.Item>
            )
        }
    ] as ColumnsType<CommentTable>
}