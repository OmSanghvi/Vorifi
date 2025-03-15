'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";
import { transactions as transactionsSchema } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";
import Chat from "@/components/chat";
import { insertTransactionSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import LoadingPage from "@/components/LoadingPage";
import TransactionsPageTour from "@/components/TransactionsPageTour";
import { useSearchParams } from 'next/navigation';
import {useSelectCategory} from "@/features/categories/hooks/use-select-category";

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {},
}

const TransactionsPage = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [AccountDialog, confirmAccount] = useSelectAccount();
    const [CategoryDialog, confirmCategory] = useSelectCategory();
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
    const [transactionData, setTransactionData] = useState(null);
    const [showTour, setShowTour] = useState(false);

    const searchParams = useSearchParams();
    const fromAccounts = searchParams?.get('fromAccounts') === 'true';

    const newTransaction = useNewTransaction();
    const createTransactions = useBulkCreateTransactions();
    const transactionsQuery = useGetTransactions();
    const deleteTransactions = useBulkDeleteTransactions();
    const accountQuery = useGetAccounts();
    const categoryQuery = useGetCategories();
    const createMutation = useCreateTransaction();

    const transactions = transactionsQuery.data || [];
    const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results);
        setVariant(VARIANTS.IMPORT);
    };

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    };

    const onSubmitImport = async (values: typeof transactionsSchema.$inferInsert[]) => {
        const accountId = await confirmAccount();
        const categoryId = await confirmCategory();
        if (!accountId) {
            return toast.error("Please select an account to continue.");
        }
        const data = values.map((value) => ({
            ...value,
            accountId: accountId as string,
            categoryId: categoryId as string,
        }));
        createTransactions.mutate(data, {
            onSuccess: () => {
                onCancelImport();
            },
        });
    };

    const handleImageUpload = (data: any) => {
        if (data && data.date && data.payee && data.amount !== undefined) {
            setTransactionData(data);
        } else {
            console.error("Invalid data received for image upload:", data);
        }
    };

    useEffect(() => {
        if (transactionData) {
            console.log(transactionData);
        }
    }, [transactionData]);

    useEffect(() => {
        if (!transactionsQuery.isLoading && !accountQuery.isLoading && !categoryQuery.isLoading) {
            setIsLoading(false);
            if (fromAccounts) {
                setShowTour(true);
            }
        }
    }, [transactionsQuery.isLoading, accountQuery.isLoading, categoryQuery.isLoading, fromAccounts]);

    if (isLoading) {
        return <LoadingPage />;
    }

    const accountOptions = (accountQuery.data ?? []).map((account: { name: string; id: string }) => ({ label: account.name, value: account.id }));
    const categoryOptions = (categoryQuery.data ?? []).map((category: { name: string; id: string }) => ({ label: category.name, value: category.id }));
    const formSchema = insertTransactionSchema.omit({
        id: true,
    });

    type FormValues = z.input<typeof formSchema>;

    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, { onSuccess: () => { newTransaction.onClose(); } });
    }

    if(isScanning){
        return <LoadingPage />;
    }

    if (variant === VARIANTS.IMPORT) {
        return (
            <>
                <AccountDialog />
                <CategoryDialog/>
                <ImportCard data={importResults.data} onCancel={onCancelImport} onSubmit={onSubmitImport} />
            </>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle
                        className="text-xl line-clamp-1"
                        data-tour="transactions-title"
                    >
                        Transactions History
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button
                            onClick={newTransaction.onOpen}
                            size="sm"
                            className="w-full lg:w-auto"
                            data-tour="add-transaction"
                        >
                            <Plus className="size-4 mr-2" />
                            Add new
                        </Button>
                        <UploadButton
                            onUpload={onUpload}
                            onImageUpload={handleImageUpload}
                            isScanning={isScanning}
                            setIsScanning={setIsScanning}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4" data-tour="transactions-filters">
                        {/* Filters component placeholder */}
                    </div>
                    <div data-tour="transactions-table">
                        <DataTable
                            filterKey="payee"
                            columns={columns}
                            data={transactions}
                            onDelete={(row) => {
                                const ids = row.map((r) => r.original.id);
                                deleteTransactions.mutate({ ids });
                            }}
                            disabled={isDisabled}
                        />
                    </div>
                </CardContent>
            </Card>

            <Chat />

            <TransactionsPageTour
                isOpen={showTour}
                onClose={() => setShowTour(false)}
            />
        </div>
    );
};

export default TransactionsPage;