import React from 'react';

interface ScalableComponentProps {
    children: React.ReactNode;
    width: number;
    height: number;
}

export const ScalableComponent: React.FC<ScalableComponentProps> = ({ children, width, height }) => {
    const getBaseDimensions = () => {
        const isChart = width >= 6 || height >= 4;
        return {
            baseWidth: isChart ? 6 : 4,
            baseHeight: isChart ? 4 : 2
        };
    };

    const { baseWidth, baseHeight } = getBaseDimensions();
    const scale = Math.min(width / baseWidth, height / baseHeight);

    return (
        <div
            className="w-full h-full origin-top-left"
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                height: `${100 / scale}%`,
                width: `${100 / scale}%`
            }}
        >
            {children}
        </div>
    );
};