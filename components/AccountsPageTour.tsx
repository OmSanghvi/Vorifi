'use client';

import { useTour, type StepType } from '@reactour/tour';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AccountsPageTourProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccountsPageTour({ isOpen, onClose }: AccountsPageTourProps) {
    const {
        setIsOpen,
        setSteps,
        setCurrentStep,
        currentStep
    } = useTour() || {};
    const router = useRouter();

    const accountSteps: StepType[] = [
        {
            selector: '[data-tour="accounts-title"]',
            content: 'Welcome to Accounts! Manage all your financial accounts in one place.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="add-account"]',
            content: 'Add new accounts to track your finances across different banks and institutions.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="accounts-table"]',
            content: 'View and manage all your accounts here. Track balances and account details easily.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="accounts-table"]',
            content: "Next, let's see how to manage your transactions!",
            stepInteraction: false
        }
    ];

    const handleTourEnd = useCallback(() => {
        if (setIsOpen) {
            setIsOpen(false);
            onClose();
            router.push('/transactions?fromAccounts=true');
        }
    }, [setIsOpen, onClose, router]);

    useEffect(() => {
        if (setSteps && isOpen) {
            setSteps(accountSteps);
            setCurrentStep?.(0);
        }
    }, [setSteps, isOpen, setCurrentStep]);

    useEffect(() => {
        if (setIsOpen) {
            setIsOpen(isOpen);
        }
    }, [isOpen, setIsOpen]);

    useEffect(() => {
        if (typeof currentStep === 'number' && currentStep === accountSteps.length - 1) {
            const timeoutId = setTimeout(handleTourEnd, 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [currentStep, accountSteps.length, handleTourEnd]);

    return null;
}