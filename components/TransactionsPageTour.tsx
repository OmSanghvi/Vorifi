'use client';

import { useTour, type StepType } from '@reactour/tour';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface TransactionsPageTourProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TransactionsPageTour({ isOpen, onClose }: TransactionsPageTourProps) {
    const {
        setIsOpen,
        setSteps,
        setCurrentStep,
        currentStep
    } = useTour() || {};
    const router = useRouter();

    const transactionSteps: StepType[] = [
        {
            selector: '[data-tour="transactions-title"]',
            content: 'Welcome to Transactions! Track all your financial activities here.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="add-transaction"]',
            content: 'Add new transactions to keep your finances up to date.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="transactions-table"]',
            content: 'View your complete transaction history with detailed information.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="transactions-filters"]',
            content: 'Filter and search through your transactions easily.',
            stepInteraction: false
        },
        {
            selector: '[data-tour="transactions-table"]',
            content: "Now, let's check out the stocks section!",
            stepInteraction: false
        }
    ];

    const handleTourEnd = useCallback(() => {
        if (setIsOpen) {
            setIsOpen(false);
            onClose();
            router.push('/stocks?fromTransactions=true');
        }
    }, [setIsOpen, onClose, router]);

    useEffect(() => {
        if (setSteps && isOpen) {
            setSteps(transactionSteps);
            setCurrentStep?.(0);
        }
    }, [setSteps, isOpen, setCurrentStep]);

    useEffect(() => {
        if (setIsOpen) {
            setIsOpen(isOpen);
        }
    }, [isOpen, setIsOpen]);

    useEffect(() => {
        if (typeof currentStep === 'number' && currentStep === transactionSteps.length - 1) {
            const timeoutId = setTimeout(handleTourEnd, 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [currentStep, transactionSteps.length, handleTourEnd]);

    return null;
}