import ReactDOM from 'react-dom/client';
import { RemainingCard } from "@/components/RemainingCard";
import { IncomeCard } from "@/components/IncomeCard";
import { Chart } from "@/components/chart";
import { SpendingPie } from "@/components/spending-pie";
import { ExpensesCard } from "@/components/ExpensesCard";
import DraggablePreview from './DraggablePreview';

interface DraggableItemProps {
    title: string;
    type: string;
    width: number;
    height: number;
    data?: any;
    onDragStart: (type: string, width: number, height: number) => void
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
                                                                title,
                                                                type,
                                                                width,
                                                                height,
                                                                onDragStart,
                                                                data
                                                            }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            type,
            width,
            height
        }));

        // Create a custom drag image
        const dragPreview = document.createElement('div');
        dragPreview.style.width = `${width * 100}px`;
        dragPreview.style.height = `${height * 100}px`;
        dragPreview.className = 'fixed opacity-90 pointer-events-none';

        const previewComponent = <DraggablePreview type={type} data={data} dateRange="Preview" />;
        const root = ReactDOM.createRoot(dragPreview);
        root.render(previewComponent);

        document.body.appendChild(dragPreview);
        e.dataTransfer.setDragImage(dragPreview, dragPreview.offsetWidth / 2, dragPreview.offsetHeight / 2);

        setTimeout(() => {
            root.unmount();
            document.body.removeChild(dragPreview);
        }, 0);

        e.dataTransfer.effectAllowed = 'move';
        onDragStart(type, width, height);
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
        >
            <div className="h-24 mb-2">
                <DraggablePreview type={type} data={data} dateRange="Preview" />
            </div>
            <p className="text-sm font-medium text-center">{title}</p>
        </div>
    );
};// components/DraggableComponents.tsx
export { DraggablePreview };