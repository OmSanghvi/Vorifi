import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetCategories } from "../api/use-get-categories";
import { useCreateCategory } from "../api/use-create-category";
import { Select } from "@/components/select";

/**
 * Custom hook for selecting a category.
 *
 * This hook provides a confirmation dialog for selecting a category from a list of categories.
 * It also allows creating a new category if needed.
 *
 * @returns {[() => JSX.Element, () => Promise<unknown>]} An array containing the ConfirmationDialog component and the confirm function.
 */
export const useSelectCategory = (): [() => JSX.Element, () => Promise<unknown>] => {
    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();

    /**
     * Function to handle the creation of a new category.
     *
     * @param {string} name - The name of the new category.
     */
    const onCreateCategory = (name: string) => categoryMutation.mutate({ name });

    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | null>(null);
    const selectValue = useRef<string>();

    /**
     * Function to confirm the category selection.
     *
     * @returns {Promise<unknown>} A promise that resolves with the selected category value.
     */
    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve });
    });

    /**
     * Function to handle the closing of the dialog.
     */
    const handleClose = () => {
        setPromise(null);
    };

    /**
     * Function to handle the confirmation of the selected category.
     */
    const handleConfirm = () => {
        promise?.resolve(selectValue.current);
        handleClose();
    };

    /**
     * Function to handle the cancellation of the dialog.
     */
    const handleCancel = () => {
        promise?.resolve(undefined);
        handleClose();
    };

    /**
     * ConfirmationDialog component for displaying the category selection dialog.
     *
     * @returns {JSX.Element} The rendered ConfirmationDialog component.
     */
    const ConfirmationDialog = () => (
        <Dialog open={promise != null} onOpenChange={handleCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Select Category
                    </DialogTitle>
                    <DialogDescription>
                        Please select an category to continue.
                    </DialogDescription>
                </DialogHeader>
                <Select
                    placeholder="Select a category"
                    options={categoryOptions}
                    onCreate={onCreateCategory}
                    onChange={(value) => selectValue.current = value}
                    disabled={categoryQuery.isLoading || categoryMutation.isPending}
                />
                <DialogFooter className="pt-2">
                    <Button onClick={handleCancel} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [ConfirmationDialog, confirm];
};