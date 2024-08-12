import React, {FC, useMemo} from 'react';
import {IProjectsCountProps} from "./IProjectsCountProps";
import {Card, Spin, Typography} from "antd";
import CardTitle from "../../../../components/CardTitle/CardTitle";
import {Bar} from "react-chartjs-2";
import {ChartData} from "chart.js";

const {Title} = Typography;

const ProjectsCount: FC<IProjectsCountProps> = ({data, loading = false}) => {
    const chartData: ChartData<'bar'> = useMemo(() => ({
        labels: ['Инициирование', 'Подготовка', 'Реализация', 'Заверешение', 'Постпроектный мониторинг', 'Архивирован', 'Отменен'],
        datasets: [
            {
                data: [
                    data?.initiation || 0,
                    data?.preparation || 0,
                    data?.realization || 0,
                    data?.completion || 0,
                    data?.post_project_monitoring || 0,
                    data?.archived || 0,
                    data?.canceled || 0
                ],
                backgroundColor: [
                    '#9B9B9B',
                    '#d9b55e',
                    '#becb64',
                    '#87d068',
                    '#87d068',
                    '#ff8e0a',
                    '#ff4646'
                ]
            }
        ]
    }), [data])

    return (
        <Spin spinning={loading}>
            <Card>
                <CardTitle>
                    <Title level={4}>Проекты по стадиям</Title>
                </CardTitle>

                <div>
                    <Bar
                        data={chartData}
                        height={300}
                        options={{
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            }
                        }}
                    />
                </div>
            </Card>
        </Spin>
    );
};

export default ProjectsCount;