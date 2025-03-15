'use client';
import './Navbar.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Navbar component that provides navigation links and authentication buttons.
 * It adapts to mobile and desktop views and includes a floating effect on scroll.
 */
export default function Navbar() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isFloating, setIsFloating] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    /**
     * Redirects the user to the sign-in page.
     */
    const handleSignIn = () => {
        router.push('/sign-in');
    };

    /**
     * Redirects the user to the sign-up page.
     */
    const handleSignUp = () => {
        router.push('/sign-up');
    };

    useEffect(() => {
        /**
         * Checks if the viewport width is less than or equal to 768 pixels
         * and updates the `isMobile` state accordingly.
         */
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        /**
         * Updates the `isFloating` state based on the scroll position.
         */
        const handleScroll = () => {
            setIsFloating(window.scrollY > 10);
        };

        checkMobile();
        handleScroll();

        window.addEventListener('resize', checkMobile);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    /**
     * Toggles the sidebar open/close state and updates the body class
     * to reflect the mobile menu state.
     */
    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
        if (!sidebarOpen) {
            document.body.classList.add('mobile-menu-open');
        } else {
            document.body.classList.remove('mobile-menu-open');
        }
    };

    return (
        <>
            <nav className={`navbar ${isFloating ? 'floating' : 'stationary'}`}>
                <div className="logo">Vorifi</div>
                {isMobile ? (
                    <button
                        className="menu-button"
                        onClick={toggleSidebar}
                        aria-label="Menu"
                    >
                        ☰
                    </button>
                ) : (
                    <>
                        <div className="links">
                            <Link href="#AboutMe">About</Link>
                            <Link href="#Skills">Features</Link>
                            <Link href="#contact">Contact</Link>
                        </div>
                        <div className="auth-buttons">
                            <button className="sign-in" onClick={handleSignIn}>
                                Sign In
                            </button>
                            <button className="sign-up" onClick={handleSignUp}>
                                Sign Up
                            </button>
                        </div>
                    </>
                )}
            </nav>

            {isMobile && (
                <div
                    className={`mobile-menu-overlay ${sidebarOpen ? 'show' : ''}`}
                    onClick={toggleSidebar}
                >
                    <div
                        className={`mobile-menu ${sidebarOpen ? 'show' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mobile-menu-header">
                            <button
                                className="close-button"
                                onClick={toggleSidebar}
                                aria-label="Close menu"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mobile-menu-content">
                            <div className="mobile-menu-links">
                                <Link href="#AboutMe" onClick={toggleSidebar}>
                                    About
                                </Link>
                                <Link href="#Skills" onClick={toggleSidebar}>
                                    Features
                                </Link>
                                <Link href="#contact" onClick={toggleSidebar}>
                                    Contact
                                </Link>
                            </div>

                            <div className="mobile-auth-buttons">
                                <button
                                    className="mobile-sign-in"
                                    onClick={() => {
                                        toggleSidebar();
                                        handleSignIn();
                                    }}
                                >
                                    Sign In
                                </button>
                                <button
                                    className="mobile-sign-up"
                                    onClick={() => {
                                        toggleSidebar();
                                        handleSignUp();
                                    }}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}