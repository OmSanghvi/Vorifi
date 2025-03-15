'use client';

import { TourProvider } from '@reactour/tour';
import { CSSProperties } from 'react';
import { type StepType } from '@reactour/tour';

export function TourProviderWrapper({
                                        children
                                    }: {
    children: React.ReactNode;
}) {
    const initialSteps: StepType[] = [
        {
            selector: '.placeholder',
            content: 'Welcome to Finance Buddy!'
        }
    ];

    return (
        <TourProvider
            steps={initialSteps}
            styles={{
                popover: (base: CSSProperties) => ({
                    ...base,
                    '--rt-color-primary': '#0070f3',
                    '--rt-color-background': '#ffffff',
                    '--rt-color-text': '#1f2937',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                } as CSSProperties),
                arrow: (base: CSSProperties) => ({
                    ...base,
                    color: '#0070f3', // Make arrow blue to match theme
                }),
                dot: (base: CSSProperties) => ({
                    ...base,
                    backgroundColor: '#0070f3',
                }),
                badge: (base: CSSProperties) => ({
                    ...base,
                    backgroundColor: '#0070f3',
                    color: '#ffffff',
                }),
                controls: (base: CSSProperties) => ({
                    ...base,
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                }),
                button: (base: CSSProperties) => ({
                    ...base,
                    color: '#0070f3',
                    ':hover': {
                        color: '#0051a8',
                    },
                }),
                navigation: (base: CSSProperties) => ({
                    ...base,
                    backgroundColor: '#ffffff',
                    color: '#0070f3',
                }),
                close: (base: CSSProperties) => ({
                    ...base,
                    color: '#1f2937',
                    ':hover': {
                        color: '#0070f3',
                    },
                }),
            }}
            padding={{ mask: 8 }}
            position={'center'}
            onClickMask={() => {}} // Prevent closing on mask click
            disableInteraction={true}
            disableKeyboardNavigation={false}
            showNavigation={true}
            showCloseButton={true}
            showDots={true}
            showBadge={true}
            startAt={0}
        >
            {children}
        </TourProvider>
    );
}