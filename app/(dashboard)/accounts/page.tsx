'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts";
import Chat from "@/components/chat";
import LoadingPage from "@/components/LoadingPage";
import AccountsPageTour from "@/components/AccountsPageTour";
import { useSearchParams } from 'next/navigation';

const AccountsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showTour, setShowTour] = useState(false);
    const searchParams = useSearchParams();
    const fromCategories = searchParams?.get('fromCategories') === 'true';

    const newAccount = useNewAccount();
    const accountsQuery = useGetAccounts();
    const deleteAccounts = useBulkDeleteAccounts();
    const accounts = accountsQuery.data || [];

    const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

    useEffect(() => {
        if (!accountsQuery.isLoading) {
            setIsLoading(false);
            if (fromCategories) {
                setShowTour(true);
            }
        }
    }, [accountsQuery.isLoading, fromCategories]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle
                        className="text-xl line-clamp-1"
                        data-tour="accounts-title"
                    >
                        Accounts
                    </CardTitle>
                    <Button
                        onClick={newAccount.onOpen}
                        size="sm"
                        data-tour="add-account"
                    >
                        <Plus className="size-4 mr-2" />
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <div data-tour="accounts-table">
                        <DataTable
                            filterKey="name"
                            columns={columns}
                            data={accounts}
                            onDelete={(row) => {
                                const ids = row.map((r) => r.original.id);
                                deleteAccounts.mutate({ ids });
                            }}
                            disabled={isDisabled}
                        />
                    </div>
                </CardContent>
            </Card>
            <Chat />

            <AccountsPageTour
                isOpen={showTour}
                onClose={() => setShowTour(false)}
            />
        </div>
    );
}

export default AccountsPage;