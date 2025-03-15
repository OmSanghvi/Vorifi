'use client';

import {useState, useEffect, useCallback, FC} from "react";
import {Responsive, WidthProvider} from "react-grid-layout";
import {Button} from "@/components/ui/button";
import {Edit3, X, Trash2, Plus} from "lucide-react";
import {Chart} from "@/components/chart";
import {SpendingPie} from "@/components/spending-pie";
import {IncomeCard} from "./IncomeCard";
import {ExpensesCard} from "./ExpensesCard";
import {RemainingCard} from "./RemainingCard";
import Chat from "@/components/chat";
import {useGetSummary} from "@/features/summary/api/use-get-summary";
import {formatDateRange} from "@/lib/utils";
import {useSearchParams} from "next/navigation";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ReactDOM from 'react-dom/client';
import {Layouts as ReactGridLayouts} from 'react-grid-layout';
import DashboardTour from './DashboardTour';


const ResponsiveGridLayout = WidthProvider(Responsive);

interface LayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

interface Layouts extends ReactGridLayouts {
    lg: LayoutItem[];
    md: LayoutItem[];
    sm: LayoutItem[];
}

interface DraggableItemProps {
    title: string;
    type: string;
    width: number;
    height: number;
    onDragStart: (type: string, width: number, height: number) => void;
    data: any;
}

interface ComponentWrapperProps {
    id: string;
    isEditMode: boolean;
    onRemove: (id: string) => void;
    children: React.ReactNode;
}

interface ComponentOption {
    title: string;
    type: string;
    width: number;
    height: number
}

interface TourProps {
    isOpen: boolean;
    onClose: () => void;
    onRestart: () => void;
}


interface DashboardClientProps {
    isOpen: boolean;
    onClose: () => void;
    onRestart: () => void;
}

const componentOptions: ComponentOption[] = [
    {title: "Income Card", type: "income", width: 4, height: 2},
    {title: "Expenses Card", type: "expenses", width: 4, height: 2},
    {title: "Remaining Card", type: "remaining", width: 4, height: 2},
    {title: "Transaction Chart", type: "transactionChart", width: 6, height: 4},
    {title: "Categories Chart", type: "categoriesChart", width: 6, height: 4},
];

const DraggableItem: React.FC<DraggableItemProps> = ({title, type, width, height, onDragStart, data}) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            type,
            width,
            height
        }));

        const dragPreview = document.createElement('div');
        dragPreview.style.width = `${width * 100}px`;
        dragPreview.style.height = `${height * 50}px`;
        dragPreview.className = 'fixed opacity-90 pointer-events-none scale-50';

        const previewComponent = <DraggablePreview type={type} data={data} dateRange="Preview"/>;
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
            onDragEnd={(e) => e.preventDefault()}
            className="p-2 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
        >
            <div className="h-20 mb-2 overflow-hidden" style={{width: '200%'}}>
                <DraggablePreview type={type} data={data} dateRange="Preview"/>
            </div>
            <p className="text-sm font-medium text-center dark:text-white">{title}</p>
        </div>
    );
};

const DraggablePreview: React.FC<{ type: string; data: any; dateRange: string }> = ({type, data, dateRange}) => {
    const previewWrapperClass = "w-full h-full transform scale-50 origin-top-left text-xs";

    switch (type) {
        case 'income':
            return <div className={previewWrapperClass}><IncomeCard data={data} dateRange={dateRange}/></div>;
        case 'expenses':
            return <div className={previewWrapperClass}><ExpensesCard data={data} dateRange={dateRange}/></div>;
        case 'remaining':
            return <div className={previewWrapperClass}><RemainingCard data={data} dateRange={dateRange}/></div>;
        case 'transactionChart':
            return <div className={`${previewWrapperClass} dark:bg-gray-800`}><Chart data={data?.days}/></div>;
        case 'categoriesChart':
            return <div className={`${previewWrapperClass} dark:bg-gray-800`}><SpendingPie data={data?.categories}/>
            </div>;
        default:
            return null;
    }
};

const ComponentWrapper: React.FC<ComponentWrapperProps> = ({id, isEditMode, onRemove, children}) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 680);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleDeleteClick = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isMobile) {
            const target = e.target as HTMLElement;
            target.style.pointerEvents = 'none';
            setTimeout(() => {
                target.style.pointerEvents = 'auto';
            }, 300);
            onRemove(id);
        } else {
            setShowConfirm(true);
        }
    };

    return (
        <div className="relative w-full h-full group">
            {isEditMode && (
                <div
                    className={`absolute ${isMobile ? 'top-2 right-2' : 'top-2 right-2'} z-[60]`}
                    style={{touchAction: 'none'}}
                    onTouchStart={(e) => {
                        e.stopPropagation();
                    }}
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                    }}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    {!showConfirm ? (
                        <div
                            className="touch-manipulation"
                            style={{touchAction: 'none'}}
                        >
                            <Button
                                variant="destructive"
                                size={isMobile ? "default" : "sm"}
                                className={`
                                    ${isMobile ? 'w-10 h-10 rounded-full p-0' : 'p-1.5'} 
                                    opacity-100 hover:opacity-100 transition-opacity shadow-lg
                                    flex items-center justify-center
                                    touch-manipulation
                                `}
                                style={{touchAction: 'none'}}
                                onTouchStart={(e) => {
                                    e.stopPropagation();
                                }}
                                onTouchEnd={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(e);
                                }}
                                onClick={(e) => {
                                    if (!isMobile) {
                                        handleDeleteClick(e);
                                    }
                                }}
                            >
                                <Trash2 className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`}/>
                            </Button>
                        </div>
                    ) : (
                        !isMobile && (
                            <div
                                className="flex gap-2 bg-white dark:bg-gray-800 p-2 rounded shadow-lg"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(id);
                                    }}
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowConfirm(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        )
                    )}
                </div>
            )}
            <div className="w-full h-full" data-tour={id.split('-')[0]}>
                {children}
            </div>
        </div>
    );
};

interface DashboardClientProps {
    isOpen: boolean;
    onClose: () => void;
    onRestart: () => void;
}

const DashboardClient: FC<DashboardClientProps> = ({ isOpen: initialIsOpen, onClose, onRestart }) => {
    const {data, isLoading} = useGetSummary();
    const params = useSearchParams();
    const to = params.get("to") || undefined;
    const from = params.get("from") || undefined;
    const accountId = params.get("accountId") || "default";
    const dateRangeLabel = formatDateRange({to, from});


    const [isMobile, setIsMobile] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [showMobileComponentSelect, setShowMobileComponentSelect] = useState(false);
    const [layouts, setLayouts] = useState<Layouts>({
        lg: [],
        md: [],
        sm: []
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [forcedLayoutSize, setForcedLayoutSize] = useState<'lg' | 'md' | 'sm'>('lg');
    const [componentCounts, setComponentCounts] = useState({
        income: 0,
        expenses: 0,
        remaining: 0,
        transactionChart: 0,
        categoriesChart: 0
    });
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleStartTour = () => {
        console.log('Starting tour...');
        onRestart(); // Use the prop instead
        setIsEditMode(false);
    };

    const handleCloseTour = () => {
        console.log('Closing tour...');
        onClose(); // Use the prop instead
    };

    const handleResize = useCallback(() => {
        const width = window.innerWidth;
        setWindowWidth(width);
        const newIsMobile = width < 680;
        setIsMobile(newIsMobile);

        if (newIsMobile) {
            setForcedLayoutSize('sm');
        } else {
            setForcedLayoutSize('lg');
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        handleResize();

        let resizeTimer: NodeJS.Timeout;
        const debouncedResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                handleResize();
            }, 100);
        };

        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(resizeTimer);
        };
    }, [handleResize]);

    const effectiveIsMobile = isMobile;

    useEffect(() => {
        const savedLayouts = localStorage.getItem(`dashboardLayouts_${accountId}`);
        const savedCounts = localStorage.getItem(`componentCounts_${accountId}`);

        if (savedLayouts && savedCounts) {
            setLayouts(JSON.parse(savedLayouts));
            setComponentCounts(JSON.parse(savedCounts));
        } else {
            const defaultLayout: Layouts = {
                lg: [
                    {i: "income-1", x: 0, y: 0, w: 4, h: 2},
                    {i: "expenses-1", x: 4, y: 0, w: 4, h: 2},
                    {i: "remaining-1", x: 8, y: 0, w: 4, h: 2},
                    {i: "transactionChart-1", x: 0, y: 2, w: 6, h: 4},
                    {i: "categoriesChart-1", x: 6, y: 2, w: 6, h: 4}
                ],
                md: [
                    {i: "income-1", x: 0, y: 0, w: 4, h: 2},
                    {i: "expenses-1", x: 4, y: 0, w: 4, h: 2},
                    {i: "remaining-1", x: 8, y: 0, w: 4, h: 2},
                    {i: "transactionChart-1", x: 0, y: 2, w: 6, h: 4},
                    {i: "categoriesChart-1", x: 6, y: 2, w: 6, h: 4}
                ],
                sm: [
                    {i: "income-1", x: 0, y: 0, w: 6, h: 2},
                    {i: "expenses-1", x: 0, y: 2, w: 6, h: 2},
                    {i: "remaining-1", x: 0, y: 4, w: 6, h: 2},
                    {i: "transactionChart-1", x: 0, y: 6, w: 6, h: 4},
                    {i: "categoriesChart-1", x: 0, y: 10, w: 6, h: 4}
                ]
            };
            const defaultCounts = {
                income: 1,
                expenses: 1,
                remaining: 1,
                transactionChart: 1,
                categoriesChart: 1
            };
            setLayouts(defaultLayout);
            setComponentCounts(defaultCounts);
            localStorage.setItem(`dashboardLayouts_${accountId}`, JSON.stringify(defaultLayout));
            localStorage.setItem(`componentCounts_${accountId}`, JSON.stringify(defaultCounts));
        }
    }, [accountId]);

    const toggleEditMode = () => {
        setIsTransitioning(true);
        setIsEditMode(!isEditMode);

        if (isMobile) {
            setForcedLayoutSize('sm');
        }

        if (isEditMode) {
            localStorage.setItem(`dashboardLayouts_${accountId}`, JSON.stringify(layouts));
            localStorage.setItem(`componentCounts_${accountId}`, JSON.stringify(componentCounts));
        }

        setTimeout(() => {
            setIsTransitioning(false);
        }, 300);
    };

    const handleLayoutChange = (currentLayout: LayoutItem[], allLayouts: Layouts) => {
        if (!isTransitioning) {
            setLayouts(allLayouts);
            if (!isEditMode) {
                localStorage.setItem(`dashboardLayouts_${accountId}`, JSON.stringify(allLayouts));
                localStorage.setItem(`componentCounts_${accountId}`, JSON.stringify(componentCounts));
            }
        }
    };

    const handleDragStart = (type: string, width: number, height: number) => {
        // Handled by DraggableItem component
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('application/json');
        if (data) {
            try {
                const {type, width, height} = JSON.parse(data) as {
                    type: string;
                    width: number;
                    height: number
                };
                const count = componentCounts[type as keyof typeof componentCounts] + 1;

                setComponentCounts(prev => ({
                    ...prev,
                    [type]: count
                }));

                const newId = `${type}-${count}`;
                const mouseX = e.clientX;
                const containerRect = e.currentTarget.getBoundingClientRect();
                const relativeX = mouseX - containerRect.left;
                const columnWidth = containerRect.width / 12;
                const gridX = Math.floor(relativeX / columnWidth);

                const newItem: LayoutItem = {
                    i: newId,
                    x: gridX,
                    y: Infinity,
                    w: width,
                    h: height
                };

                setLayouts(prev => ({
                    lg: [...prev.lg, newItem],
                    md: [...prev.md, {...newItem}],
                    sm: [...prev.sm, {...newItem, x: 0, w: 6}]
                }));
            } catch (error) {
                console.error('Error processing drop:', error);
            }
        }
    };

    const addComponent = (option: ComponentOption) => {
        const count = componentCounts[option.type as keyof typeof componentCounts] + 1;

        setComponentCounts(prev => ({
            ...prev,
            [option.type]: count
        }));

        const newId = `${option.type}-${count}`;

        const newItem = {
            i: newId,
            x: 0,
            y: Infinity,
            w: effectiveIsMobile ? 6 : option.width,
            h: option.height
        };

        setLayouts(prev => ({
            lg: [...prev.lg, {...newItem, x: 0, w: option.width}],
            md: [...prev.md, {...newItem, x: 0, w: option.width}],
            sm: [...prev.sm, {...newItem, x: 0, w: 6}]
        }));

        setShowMobileComponentSelect(false);
    };

    const removeComponent = (id: string) => {
        const removeFromLayout = (layout: LayoutItem[]) =>
            layout.filter(item => item.i !== id);

        setLayouts(prev => ({
            lg: removeFromLayout(prev.lg),
            md: removeFromLayout(prev.md),
            sm: removeFromLayout(prev.sm)
        }));

        localStorage.setItem(`dashboardLayouts_${accountId}`, JSON.stringify(layouts));
    };

    // In your renderComponent function
    // In your renderComponent function
    const renderComponent = (id: string) => {
        const baseType = id.split('-')[0];
        switch (baseType) {
            case 'income':
                return data && (
                    <div data-tour="income" className="w-full h-full">
                        <IncomeCard data={data} dateRange={dateRangeLabel}/>
                    </div>
                );
            case 'expenses':
                return data && (
                    <div data-tour="expenses" className="w-full h-full">
                        <ExpensesCard data={data} dateRange={dateRangeLabel}/>
                    </div>
                );
            case 'remaining':
                return data && (
                    <div data-tour="remaining" className="w-full h-full">
                        <RemainingCard data={data} dateRange={dateRangeLabel}/>
                    </div>
                );
            case 'transactionChart':
                return (
                    <div data-tour="transaction-chart" className="w-full h-full">
                        <Chart data={data?.days}/>
                    </div>
                );
            case 'categoriesChart':
                return (
                    <div data-tour="categories-chart" className="w-full h-full">
                        <SpendingPie data={data?.categories}/>
                    </div>
                );
            default:
                return null;
        }
    };
    if (typeof window === "undefined") return null;
    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 mb-0 relative">

            {/* Edit mode button */}
            <div className={`fixed z-50 ${isMobile ? 'bottom-4 left-4' : 'top-4 right-4'}`}>
                <Button
                    data-testid="edit-mode-button"
                    onClick={toggleEditMode}
                    className={`
                        bg-white text-black dark:bg-gray-800 dark:text-white 
                        hover:bg-gray-200 dark:hover:bg-gray-700 
                        shadow-lg
                        ${isMobile ? 'w-12 h-12 rounded-full p-0' : ''}
                        flex items-center justify-center
                    `}
                    size={isMobile ? "lg" : "default"}
                >
                    {isEditMode ?
                        <X className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`}/> :
                        <Edit3 className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`}/>
                    }
                </Button>
            </div>

            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="min-h-screen relative overflow-hidden transition-all duration-300"
            >
                <ResponsiveGridLayout
                    className="layout"
                    layouts={layouts}
                    breakpoints={{lg: 1200, md: 996, sm: 0}}
                    cols={{lg: 12, md: 12, sm: 6}}
                    rowHeight={100}
                    onLayoutChange={(currentLayout, allLayouts) =>
                        handleLayoutChange(currentLayout, allLayouts as Layouts)}
                    isDraggable={isEditMode}
                    isResizable={false}
                    containerPadding={[16, 16]}
                    margin={[16, 16]}
                    style={{
                        marginRight: isEditMode && !isMobile ? '16rem' : '0',
                        transition: 'margin-right 300ms'
                    }}
                    breakpoint={isMobile ? 'sm' : forcedLayoutSize}
                    onBreakpointChange={(newBreakpoint) => {
                        if (!isEditMode && !isMobile) {
                            setForcedLayoutSize(newBreakpoint as 'lg' | 'md' | 'sm');
                        }
                    }}
                >
                    {layouts.lg.map((layout) => (
                        <div key={layout.i}>
                            <ComponentWrapper
                                id={layout.i}
                                isEditMode={isEditMode}
                                onRemove={removeComponent}
                            >
                                {renderComponent(layout.i)}
                            </ComponentWrapper>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>

            <DashboardTour
                isOpen={initialIsOpen} // Use the prop passed from parent
                onClose={onClose}
                onRestart={onRestart}
            />


            <div className="fixed bottom-4 right-4 w-80 h-64">
                <Chat/>
            </div>

            {/* Mobile Add Component Button */}
            {isMobile && isEditMode && !showMobileComponentSelect && (
                <div className="fixed top-4 left-4 z-50">
                    <Button
                        onClick={() => setShowMobileComponentSelect(true)}
                        className="bg-white text-black dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
                    >
                        <Plus className="h-8 w-8"/>
                    </Button>
                </div>
            )}

            {/* Mobile Component Selector Dialog */}
            {isMobile && isEditMode && showMobileComponentSelect && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
                    <div
                        className="bg-white dark:bg-gray-800 rounded-t-xl p-6 w-full max-h-[80vh] overflow-y-auto"
                        style={{
                            transform: showMobileComponentSelect ? 'translateY(0)' : 'translateY(100%)',
                            transition: 'transform 0.3s ease-in-out'
                        }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold dark:text-white">Add Component</h3>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="p-3"
                                onClick={() => setShowMobileComponentSelect(false)}
                            >
                                <X className="h-6 w-6"/>
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {componentOptions.map((option) => (
                                <Button
                                    key={option.type}
                                    variant="outline"
                                    size="lg"
                                    className="w-full justify-start text-left p-6 text-lg"
                                    onClick={() => {
                                        addComponent(option);
                                        setShowMobileComponentSelect(false);
                                    }}
                                >
                                    {option.title}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            {!isMobile && (
                <div
                    className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg p-4 transform transition-transform duration-300 ease-in-out ${
                        isEditMode ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    style={{zIndex: 40}}
                >
                    <div className="flex flex-col space-y-4">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Add Components</h3>
                        {componentOptions.map((option) => (
                            <DraggableItem
                                key={option.type}
                                title={option.title}
                                type={option.type}
                                width={option.width}
                                height={option.height}
                                onDragStart={handleDragStart}
                                data={data}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
export default DashboardClient;