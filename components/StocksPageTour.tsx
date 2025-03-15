'use client';

import { useTour, type StepType } from '@reactour/tour';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface StocksPageTourProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StocksPageTour({ isOpen, onClose }: StocksPageTourProps) {
    const {
        setIsOpen,
        setSteps,
        setCurrentStep,
        currentStep
    } = useTour() || {};
    const router = useRouter();

    const stockSteps: StepType[] = [
        {
            selector: '[data-tour="stocks-title"]',
            content: 'Welcome to Stocks! Monitor stock market trends and performance.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="stock-chart"]',
            content: 'Analyze stock performance with detailed charts and metrics.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="stock-chart"]',
            content: "Finally, let's look at your settings!",
            stepInteraction: false
        }
    ];

    const handleTourEnd = useCallback(() => {
        if (setIsOpen) {
            setIsOpen(false);
            onClose();
            router.push('/settings?fromStocks=true');
        }
    }, [setIsOpen, onClose, router]);

    useEffect(() => {
        if (setSteps && isOpen) {
            setSteps(stockSteps);
            setCurrentStep?.(0);
        }
    }, [setSteps, isOpen, setCurrentStep]);

    useEffect(() => {
        if (setIsOpen) {
            setIsOpen(isOpen);
        }
    }, [isOpen, setIsOpen]);

    useEffect(() => {
        if (typeof currentStep === 'number' && currentStep === stockSteps.length - 1) {
            const timeoutId = setTimeout(handleTourEnd, 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [currentStep, stockSteps.length, handleTourEnd]);

    return null;
}