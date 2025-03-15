import { HeaderLogo } from "@/components/header-logo";
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { WelcomeMsg } from "./welcome-msg";
import { Filters } from "./filters";
import { useMedia } from "react-use";
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Sidebar, { SidebarItem } from "@/components/navigation";
import Link from "next/link";
import { MdAccountBalance, MdCategory, MdDashboard, MdReceipt, MdSettings } from "react-icons/md";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { RiStockLine } from "react-icons/ri";

/**
 * Header component for displaying the header section of the application.
 *
 * This component includes the logo, user button, welcome message, filters, and a sidebar toggle button for mobile view.
 * It also handles theme changes and updates the current path based on the navigation.
 *
 * @returns {JSX.Element} The rendered Header component.
 */
export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const isMobile = useMedia("(max-width: 1024px)", false);
    const pathname = usePathname();
    const [currentPath, setCurrentPath] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setCurrentPath(pathname);
    }, [pathname]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        }

        const handleThemeChange = () => {
            const newTheme = localStorage.getItem('theme');
            setIsDarkMode(newTheme === 'dark');
        };

        window.addEventListener('storage', handleThemeChange);

        return () => {
            window.removeEventListener('storage', handleThemeChange);
        };
    }, []);

    const routes = [
        { href: "/", label: "Overview" },
        { href: "/transactions", label: "Transactions" },
        { href: "/accounts", label: "Accounts" },
        { href: "/categories", label: "Categories" },
        { href: "/stocks", label: "Stocks" },

        { href: "/settings", label: "Settings" }
    ];

    /**
     * Toggles the sidebar open and close state.
     */
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    return (
        <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-14">
                    {isMobile && (
                        <Button onClick={toggleSidebar} className={`lg:hidden bg-transparent`}>
                            <Menu className="text-white"/>
                        </Button>
                    )}
                    {isMobile && (
                        <div className="flex items-center justify-center w-full">
                            <Image src="/logo.svg" alt="Logo" height={30} width={28} />
                            <p className='font-semibold text-white text-3xl ml-2.5'>
                                Vorifi
                            </p>
                        </div>
                    )}
                    {isMobile && (
                        <ClerkLoaded>
                            <UserButton afterSignOutUrl="/home" />
                        </ClerkLoaded>
                    )}
                    {isMobile && (
                        <ClerkLoading>
                            <Loader2 className="size-8 animate-spin text-slate-400" />
                        </ClerkLoading>
                    )}
                </div>
                <WelcomeMsg />
                <Filters />
            </div>
            {isMobile && isSidebarExpanded && (
                <Sidebar expanded={isSidebarExpanded} setExpanded={setIsSidebarExpanded}>
                    {routes.map((route) => (
                        <Link href={route.href} key={route.href}>
                            <SidebarItem
                                icon={
                                    route.href === '/' ? <MdDashboard /> :
                                        route.href === '/transactions' ? <MdReceipt /> :
                                            route.href === '/accounts' ? <MdAccountBalance /> :
                                                route.href === '/categories' ? <MdCategory /> :
                                                    route.href === '/stocks' ? <RiStockLine /> :
                                                    route.href === '/settings' ? <MdSettings /> :
                                                        null
                                }
                                text={route.label}
                                active={currentPath === route.href}
                                alert={false}
                            />
                        </Link>
                    ))}
                </Sidebar>
            )}
        </header>
    );
};