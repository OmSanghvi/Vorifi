'use client';

import { useTour, type StepType } from '@reactour/tour';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface CategoriesPageTourProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CategoriesPageTour({ isOpen, onClose }: CategoriesPageTourProps) {
    const {
        setIsOpen,
        setSteps,
        setCurrentStep,
        currentStep
    } = useTour() || {};
    const router = useRouter();

    const categorySteps: StepType[] = [
        {
            selector: '[data-tour="categories-title"]',
            content: 'Welcome to Categories! Here you can manage all your spending categories.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="add-category"]',
            content: 'Click here to create a new category for organizing your expenses.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="categories-table"]',
            content: 'View and manage all your categories here. You can edit or delete categories as needed.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="categories-table"]',
            content: "Great! Now let's check out your accounts!",
            stepInteraction: false
        }
    ];

    const handleTourEnd = useCallback(() => {
        if (setIsOpen) {
            setIsOpen(false);
            onClose();
            router.push('/accounts?fromCategories=true');
        }
    }, [setIsOpen, onClose, router]);

    // Initialize tour
    useEffect(() => {
        if (setSteps && isOpen) {
            setSteps(categorySteps);
            setCurrentStep?.(0);
        }
    }, [setSteps, isOpen, setCurrentStep]);

    // Handle tour state
    useEffect(() => {
        if (setIsOpen) {
            setIsOpen(isOpen);
        }
    }, [isOpen, setIsOpen]);

    // Handle tour completion
    useEffect(() => {
        if (typeof currentStep === 'number' && currentStep === categorySteps.length - 1) {
            const timeoutId = setTimeout(handleTourEnd, 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [currentStep, categorySteps.length, handleTourEnd]);

    return null;
}