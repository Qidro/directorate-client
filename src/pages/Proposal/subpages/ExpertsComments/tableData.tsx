import {ColumnsType} from "antd/es/table";
import {ProposalExpert} from "../../../../types/proposal";
import {CSSProperties} from "react";

export interface ITableDataType {
    key: string | number;
    proposalField: string;
    proposalInfo: any;
    [key: number]: any;
}

const cellStyle: CSSProperties = {
    maxHeight: 200,
    display: 'inline-block',
    overflowY: 'auto',
    margin: -16,
    padding: 16,
    whiteSpace: 'pre-line'
}

export const getColumns = (
    experts: ProposalExpert[],
    anonymous: boolean
) => {
    return [
        {
            key: 'proposalField',
            dataIndex: 'proposalField',
            rowScope: 'row',
            width: '150px',
        },
        {
            key: 'proposalInfo',
            dataIndex: 'proposalInfo',
            width: '150px',
            render: (value) => (
                <div style={cellStyle}>
                    {value}
                </div>
            )
        },
        ...experts.map((expert, index) => {
            const name = expert.user.fullname.split(' ')

            return {
                key: expert.user.id,
                dataIndex: expert.user.id,
                title: !anonymous
                    ? `${name[0]} ${name[1][0]}. ${name[2][0]}.`
                    : `Эксперт ${index+1}`
                ,
                width: '300px',
                render: (value: string) => (
                    <div style={cellStyle}>
                        {value}
                    </div>
                )
            }
        })
    ] as ColumnsType<ITableDataType>
}