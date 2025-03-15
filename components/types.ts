export interface LayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface ComponentOption {
    title: string;
    type: string;
    width: number;
    height: number;
}

export interface DraggableItemProps {
    title: string;
    type: string;
    width: number;
    height: number;
    onDragStart: (type: string, width: number, height: number) => void;
    data: any;
}

export interface ComponentWrapperProps {
    id: string;
    isEditMode: boolean;
    onRemove: (id: string) => void;
    children: React.ReactNode;
}

export interface DashboardClientProps {
    isOpen: boolean;
    onClose: () => void;
    onRestart: () => void;
}