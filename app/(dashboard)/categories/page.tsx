'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";
import Chat from "@/components/chat";
import LoadingPage from "@/components/LoadingPage";
import CategoriesPageTour from "@/components/CategoriesPageTour";
import { useSearchParams } from 'next/navigation';

const CategoriesPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showTour, setShowTour] = useState(false);
    const searchParams = useSearchParams();
    const fromDashboard = searchParams?.get('fromDashboard') === 'true';

    const newCategory = useNewCategory();
    const categoriesQuery = useGetCategories();
    const deleteCategories = useBulkDeleteCategories();
    const categories = categoriesQuery.data || [];

    const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending;

    useEffect(() => {
        if (!categoriesQuery.isLoading) {
            setIsLoading(false);
            // Start tour after loading if coming from dashboard
            if (fromDashboard) {
                setShowTour(true);
            }
        }
    }, [categoriesQuery.isLoading, fromDashboard]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle
                        className="text-xl line-clamp-1"
                        data-tour="categories-title"
                    >
                        Categories
                    </CardTitle>
                    <Button
                        onClick={newCategory.onOpen}
                        size="sm"
                        data-tour="add-category"
                    >
                        <Plus className="size-4 mr-2" />
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <div data-tour="categories-table">
                        <DataTable
                            filterKey="name"
                            columns={columns}
                            data={categories}
                            onDelete={(row) => {
                                const ids = row.map((r) => r.original.id);
                                deleteCategories.mutate({ ids });
                            }}
                            disabled={isDisabled}
                        />
                    </div>
                </CardContent>
            </Card>
            <Chat />

            <CategoriesPageTour
                isOpen={showTour}
                onClose={() => setShowTour(false)}
            />
        </div>
    );
}

export default CategoriesPage;