'use client';

import { useTour, type StepType } from '@reactour/tour';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SettingsPageTourProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsPageTour({ isOpen, onClose }: SettingsPageTourProps) {
    const {
        setIsOpen,
        setSteps,
        setCurrentStep,
        currentStep
    } = useTour() || {};

    const settingSteps: StepType[] = [
        {
            selector: '[data-tour="settings-title"]',
            content: 'Welcome to Settings! Customize your Finance Buddy experience.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="settings-card"]',
            content: 'Manage your bank account and personal information here.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="settings-title"]',
            content: "That's it! You've completed the tour of Finance Buddy. Enjoy managing your finances!",
            stepInteraction: false
        }
    ];

    const handleTourEnd = useCallback(() => {
        if (setIsOpen) {
            setIsOpen(false);
            onClose();
        }
    }, [setIsOpen, onClose]);

    useEffect(() => {
        if (setSteps && isOpen) {
            setSteps(settingSteps);
            setCurrentStep?.(0);
        }
    }, [setSteps, isOpen, setCurrentStep]);

    useEffect(() => {
        if (setIsOpen) {
            setIsOpen(isOpen);
        }
    }, [isOpen, setIsOpen]);

    useEffect(() => {
        if (typeof currentStep === 'number' && currentStep === settingSteps.length - 1) {
            const timeoutId = setTimeout(handleTourEnd, 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [currentStep, settingSteps.length, handleTourEnd]);

    return null;
}