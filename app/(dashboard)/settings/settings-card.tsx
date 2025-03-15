"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlaidConnect } from "@/features/plaid/components/plaid-connect";
import { useGetConnectedBank } from "@/features/plaid/api/use-get-connected-bank";
import { PlaidDisconnect } from "@/features/plaid/components/plaid-disconnect";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import DashboardTour from "@/components/DashboardTour";

export const SettingsCard = () => {
    const router = useRouter();
    const {
        data: connectedBank,
        isLoading: isLoadingConnectedBank
    } = useGetConnectedBank();

    const [isTourOpen, setIsTourOpen] = useState(false);

    const handleStartTour = () => {
        router.push('/?fromSettings=true');
        setIsTourOpen(false);
    };

    if (isLoadingConnectedBank) {
        return (
            <Card className="border-none drop-shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl line-clamp-1">
                        <Skeleton className="h-6 w-24" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full flex items-center justify-center">
                        <Loader2 className="size-6 text-slate-300 animate-spin" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl line-clamp-1">
                    Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Separator />
                <div className="flex flex-col gap-y-2 lg:flex-row items-center py-4">
                    <p className="text-sm font-medium w-full lg:w-[16.5rem]">
                        Bank Account
                    </p>
                    <div className="w-full flex items-center justify-between">
                        <div className={cn(
                            "text-sm truncate flex items-center",
                            !connectedBank && "text-muted-foreground"
                        )}>
                            {connectedBank
                                ? "Bank account connected"
                                : "No bank account connected"
                            }
                        </div>
                        {connectedBank
                            ? <PlaidDisconnect />
                            : <PlaidConnect />
                        }
                    </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-y-2 lg:flex-row items-center py-4">
                    <p className="text-sm font-medium w-full lg:w-[16.5rem]">
                        App Tour
                    </p>
                    <div className="w-full flex items-center justify-between">
                        <div className="text-sm truncate flex items-center text-muted-foreground">
                            Start the app tour to learn about features
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleStartTour}
                        >
                            Start Tour
                        </Button>
                    </div>
                </div>
                <DashboardTour
                    isOpen={isTourOpen}
                    onClose={() => setIsTourOpen(false)}
                    onRestart={() => setIsTourOpen(true)}
                />
            </CardContent>
        </Card>
    );
};