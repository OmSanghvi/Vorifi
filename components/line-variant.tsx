import ReactECharts from 'echarts-for-react';
import { format } from 'date-fns';

type Props = {
    data: {
        date: string;
        income: number;
        expenses: number;
    }[];
};

/**
 * LineVariant component for displaying a line chart with income and expenses data.
 *
 * This component renders a responsive line chart using the Echarts library.
 * It includes a custom tooltip and formatted X-axis labels.
 *
 * @param {Props} props - The properties for the LineVariant component.
 * @returns {JSX.Element} The rendered LineVariant component.
 */
export const LineVariant = ({ data }: Props) => {
    const formattedData = data.map(item => ({
        ...item,
        date: format(new Date(item.date), 'dd MMMM'),
    }));

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
            },
        },
        legend: {
            data: ['Income', 'Expenses'],
        },
        xAxis: {
            type: 'category',
            data: formattedData.map(item => item.date),
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'Income',
                type: 'line',
                showSymbol: false,
                data: formattedData.map(item => item.income),
                itemStyle: {
                    color: '#3b82f6',
                },
                lineStyle: {
                    width: 2,
                    type: 'solid',
                },
            },
            {
                name: 'Expenses',
                type: 'line',
                showSymbol: false,
                data: formattedData.map(item => item.expenses),
                itemStyle: {
                    color: '#f43f5e',
                },
                lineStyle: {
                    width: 2,
                    type: 'solid',
                },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 350, width: '100%' }} />;
};