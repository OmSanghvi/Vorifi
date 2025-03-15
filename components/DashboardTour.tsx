'use client';

import { FC } from 'react';
import { useTour, type StepType } from '@reactour/tour';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardTourProps {
    isOpen: boolean;
    onClose: () => void;
    onRestart: () => void;
}

const DashboardTour: FC<DashboardTourProps> = ({ isOpen, onClose, onRestart }) => {
    const {
        setIsOpen,
        setSteps,
        setCurrentStep,
        currentStep
    } = useTour() || {};
    const router = useRouter();

    const dashboardSteps: StepType[] = [
        {
            selector: '[data-tour="income"]',
            content: '💰 Monitor your income in real-time.',
            stepInteraction: false,
        },
        {
            selector: '[data-tour="expenses"]',
            content: '💳 Track all your expenses in one place.',
            stepInteraction: false,
        },
        {
            selector: '[data-tour="remaining"]',
            content: '🎯 See your remaining budget at a glance.',
            stepInteraction: false,
        },
        {
            selector: '[data-tour="transaction-chart"]',
            content: '📊 Visualize your spending patterns over time.',
            stepInteraction: false,
        },
        {
            selector: '[data-tour="categories-chart"]',
            content: '🥧 Break down your spending by category.',
            stepInteraction: false,
        },
        {
            selector: '[data-tour="categories-chart"]',
            content: "Let's check out the categories page to manage your spending categories!",
            stepInteraction: false,
        }
    ];

    const handleTourEnd = useCallback(() => {
        if (setIsOpen) {
            setIsOpen(false);
            onClose();
            router.push('/categories?fromDashboard=true');
        }
    }, [setIsOpen, onClose, router]);

    // Set initial steps
    useEffect(() => {
        if (setSteps && isOpen) {
            setSteps(dashboardSteps);
            setCurrentStep?.(0);
            onRestart(); // Call onRestart when the tour starts
        }
    }, [setSteps, isOpen, setCurrentStep, onRestart]);

    // Handle tour state
    useEffect(() => {
        if (setIsOpen) {
            setIsOpen(isOpen);
        }
    }, [isOpen, setIsOpen]);
    // Handle tour completion
    useEffect(() => {
        if (typeof currentStep === 'number' && currentStep === dashboardSteps.length - 1) {
            const timeoutId = setTimeout(handleTourEnd, 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [currentStep, handleTourEnd, dashboardSteps.length]);

    return null;
}

export default DashboardTour;