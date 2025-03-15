'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardClient from '@/components/DashboardClient';

const DashboardPage = () => {
    const [isTourOpen, setIsTourOpen] = useState(false);
    const searchParams = useSearchParams();
    const fromSettings = searchParams?.get('fromSettings') === 'true';

    useEffect(() => {
        if (fromSettings) {
            setIsTourOpen(true);
        }
    }, [fromSettings]);

    return (
        <DashboardClient
            isOpen={isTourOpen}
            onClose={() => setIsTourOpen(false)}
            onRestart={() => setIsTourOpen(true)}
        />
    );
};

export default DashboardPage;