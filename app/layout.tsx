import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { QueryProvider } from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";
import { Toaster } from "@/components/ui/sonner";
import { TourProviderWrapper } from "@/components/providers/tour-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Vorifi",
    description: "Personal Financial Manager",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en">
            <body className={inter.className}>
            <QueryProvider>
                <TourProviderWrapper>
                    <SheetProvider />
                    <Toaster />
                    {children}
                </TourProviderWrapper>
            </QueryProvider>
            </body>
            </html>
        </ClerkProvider>
    );
}