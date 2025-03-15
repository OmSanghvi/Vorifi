'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StockChart from './StockChart';
import Chat from "@/components/chat";
import LoadingPage from "@/components/LoadingPage";
import StocksPageTour from "@/components/StocksPageTour";
import { useSearchParams } from 'next/navigation';

const StocksPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showTour, setShowTour] = useState(false);
    const searchParams = useSearchParams();
    const fromTransactions = searchParams?.get('fromTransactions') === 'true';

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
            if (fromTransactions) {
                setShowTour(true);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [fromTransactions]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader>
                    <CardTitle
                        className="text-xl line-clamp-1"
                        data-tour="stocks-title"
                    >
                        Stocks
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div data-tour="stock-chart">
                        <StockChart />
                    </div>
                </CardContent>
            </Card>
            <Chat />

            <StocksPageTour
                isOpen={showTour}
                onClose={() => setShowTour(false)}
            />
        </div>
    );
};

export default StocksPage;