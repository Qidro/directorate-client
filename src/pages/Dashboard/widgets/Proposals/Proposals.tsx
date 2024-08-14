import React, {FC, useMemo} from 'react';
import {Doughnut} from "react-chartjs-2";
import {Card, Empty, Spin, Typography} from "antd";
import {IProposalsProps} from "./IProposalsProps";
import {ChartData} from "chart.js";
import CardTitle from "../../../../components/CardTitle/CardTitle";

const {Title} = Typography;

const Proposals: FC<IProposalsProps> = ({success, reject, archived, development, loading = false}) => {
    const data: ChartData<'doughnut'> = useMemo(() => ({
        labels: ['Одобрено', 'Отправлено на доработку', 'Отменено', 'В разработке'],
        datasets: [
            {
                data: [success, reject, archived, development],
                backgroundColor: [
                    '#87d068',
                    '#ffa436',
                    '#ff4646',
                    '#0000ff'
                ]
            }
        ]
    }), [success, reject, archived])

    const isEmpty = useMemo(() => {
        return success === 0 && reject === 0 && archived === 0;
    }, [success, reject, archived])

    return (
        <Spin spinning={loading}>
            <Card>
                <CardTitle>
                    <Title level={4}>Проектные предложения</Title>
                </CardTitle>

                <div>
                    {!isEmpty ? (
                        <Doughnut
                            data={data}
                            height={300}
                            options={{
                                maintainAspectRatio: false
                            }}
                        />
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                    )}
                </div>
            </Card>
        </Spin>
    );
};

export default Proposals;