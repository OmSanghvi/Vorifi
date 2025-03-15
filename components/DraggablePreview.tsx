import { IncomeCard } from "@/components/IncomeCard";
import { RemainingCard } from "@/components/RemainingCard";
import { ExpensesCard } from "@/components/ExpensesCard";
import { SpendingPie } from "@/components/spending-pie";
import { Chart } from "@/components/chart";

interface DraggablePreviewProps {
    type: string;
    data?: any;
    dateRange?: string;
}

const DraggablePreview: React.FC<DraggablePreviewProps> = ({ type, data, dateRange = "N/A" }) => {
    const renderPreviewComponent = () => {
        switch (type) {
            case 'income':
                return <IncomeCard data={data} dateRange={dateRange} />;
            case 'expenses':
                return <ExpensesCard data={data} dateRange={dateRange} />;
            case 'remaining':
                return <RemainingCard data={data} dateRange={dateRange} />;
            case 'chart1':
                return <Chart data={data?.days} />;
            case 'chart2':
                return <SpendingPie data={data?.categories} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {renderPreviewComponent()}
        </div>
    );
};

export default DraggablePreview;