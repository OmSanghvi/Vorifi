import ReactECharts from 'echarts-for-react';
import { format } from 'date-fns';

type Props = {
    data: {
        date: string,
        income: number,
        expenses: number,
    }[];
};

/**
 * Component for rendering a bar chart with income and expenses data.
 *
 * This component displays a bar chart using Echarts, with bars for income and expenses.
 * It also includes a custom tooltip and formatted X-axis labels.
 *
 * @param {Props} props - The properties for the BarVariant component.
 * @param {Array} props.data - The data to be displayed in the chart, each entry containing a date, income, and expenses.
 * @returns {JSX.Element} The rendered BarVariant component.
 */
export const BarVariant = ({ data }: Props) => {
    const formattedData = data.map(item => ({
        ...item,
        date: format(new Date(item.date), 'dd MMMM'),
    }));

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
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
                type: 'bar',
                barWidth: 10,
                data: formattedData.map(item => item.income),
                itemStyle: {
                    color: '#3b82f6',
                },
            },
            {
                name: 'Expenses',
                type: 'bar',
                barWidth: 10,
                data: formattedData.map(item => item.expenses),
                itemStyle: {
                    color: '#f43f5e',
                },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 350, width: '100%' }} />;
};