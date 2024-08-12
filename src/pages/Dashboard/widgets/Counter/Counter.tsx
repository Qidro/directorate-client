import React, {FC} from 'react';
import {Card, Space, Spin, Statistic} from "antd";
import {ICounterProps} from "./ICounterProps";

const Counter: FC<ICounterProps> = ({projectCount, proposalCount, backpackCount, loading = false}) => {
    return (
        <Spin spinning={loading}>
            <Card>
                <Space size='middle' direction='vertical'>
                    <Statistic title='Количество проектов' value={projectCount}/>
                    <Statistic title='Количество портфелей' value={backpackCount}/>
                    <Statistic title='Количество проектных предложения' value={proposalCount}/>
                </Space>
            </Card>
        </Spin>
    );
};

export default React.memo(Counter);