'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chat from "@/components/chat";
import LoadingPage from "@/components/LoadingPage";
import SettingsPageTour from "@/components/SettingsPageTour";
import { useSearchParams } from 'next/navigation';
import {SettingsCard} from "@/app/(dashboard)/settings/settings-card";

const SettingsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showTour, setShowTour] = useState(false);
    const searchParams = useSearchParams();
    const fromStocks = searchParams?.get('fromStocks') === 'true';

    useEffect(() => {
        setIsLoading(false);
        if (fromStocks) {
            setShowTour(true);
        }
    }, [fromStocks]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <SettingsCard/>
            <Chat />

            <SettingsPageTour
                isOpen={showTour}
                onClose={() => setShowTour(false)}
            />
        </div>
    );
}

export default SettingsPage;