import {Button, Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {ColumnType} from "antd/es/table";

const { Search } = Input;

const resetFilters = (clearFilters?: () => void, confirm?: () => void) => {
    if (clearFilters) clearFilters()
    if (confirm) confirm()
}

export const getColumnSearch = (dataIndex: string, placeholder: string): ColumnType<any> => {
    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{ padding: 8 }}>
                <Search
                    placeholder={placeholder}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys([e.target.value])}
                    onPressEnter={() => confirm()}
                    onSearch={() => confirm()}
                    enterButton
                    autoFocus
                />
                <Button
                    type='text'
                    danger
                    onClick={() => resetFilters(clearFilters, confirm)}
                    style={{marginTop: 10}}
                    block
                >Сбросить</Button>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#e63636' : undefined, fontSize: 14}}/>
        ),
        onFilter: (value, record) => {
            return record[dataIndex].toLowerCase().includes(value.toString().toLowerCase())
        }
    }
}