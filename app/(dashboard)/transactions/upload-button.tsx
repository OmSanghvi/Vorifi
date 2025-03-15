import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Receipt, Loader2 } from "lucide-react";
import { useCSVReader } from "react-papaparse";
import { scanReceipt } from "@/lib/receipt-scanner";
import { useRef } from "react";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { toast } from "sonner";

type Props = {
    onUpload: (results: any) => void;
    onImageUpload: (data: any) => void;
    isScanning: boolean;
    setIsScanning: (isScanning: boolean) => void;
}

export const UploadButton = ({ onUpload, onImageUpload, isScanning, setIsScanning }: Props) => {
    const newTransaction = useNewTransaction();
    const { CSVReader } = useCSVReader();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileType = file.type;
            if (fileType.startsWith("image/")) {
                setIsScanning(true);
                try {
                    const scannedData = await scanReceipt(file);
                    setIsScanning(false);
                    onImageUpload(scannedData);
                    if (scannedData?.date && scannedData?.payee && scannedData?.amount !== undefined) {
                        newTransaction.onOpen(scannedData);
                    } else {
                        toast.error("Failed to extract all required fields from the receipt.");
                        console.error("Invalid data received for image upload:", scannedData);
                    }
                } catch (error) {
                    setIsScanning(false);
                    toast.error("Error scanning receipt");
                    console.error("Error scanning receipt:", error);
                }
            } else {
                toast.error("Unsupported file type");
                console.error("Unsupported file type");
            }
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex items-center gap-x-2">
            <CSVReader onUploadAccepted={onUpload}>
                {({ getRootProps }: any) => (
                    <Button
                        size="icon"
                        {...getRootProps()}
                        disabled={isScanning}
                        title="Import CSV"
                    >
                        <FileSpreadsheet className="size-4" />
                    </Button>
                )}
            </CSVReader>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
            />
            <Button
                size="icon"
                onClick={handleButtonClick}
                disabled={isScanning}
                title="Scan Receipt"
            >
                {isScanning ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <Receipt className="size-4" />
                )}
            </Button>
        </div>
    );
};