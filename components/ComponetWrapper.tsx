import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ScalableComponent } from './ScalableComponent';

interface ComponentWrapperProps {
    id: string;
    isEditMode: boolean;
    onRemove: (id: string) => void;
    children: React.ReactNode;
    width: number;
    height: number;
}

export const ComponentWrapper: React.FC<ComponentWrapperProps> = ({
                                                                      id,
                                                                      isEditMode,
                                                                      onRemove,
                                                                      children,
                                                                      width,
                                                                      height
                                                                  }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="relative w-full h-full group overflow-hidden">
            {isEditMode && (
                <div
                    className="absolute top-2 right-2 z-50"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    {!showConfirm ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="p-1.5 h-auto opacity-100 hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowConfirm(true);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    ) : (
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
                    )}
                </div>
            )}
            <div className="w-full h-full">
                <ScalableComponent width={width} height={height}>
                    {children}
                </ScalableComponent>
            </div>
        </div>
    );
};