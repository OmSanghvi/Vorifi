import React from 'react';
import Link from 'next/link';
import type { StaticImageData } from 'next/image';
import Image from './img.png';

/**
 * Hero component that displays the main hero section of the homepage.
 *
 * @returns {JSX.Element} The rendered hero section.
 */
const Hero: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to-blue-600 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-40 left-20 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 pt-40 pb-20">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-yellow-300 mb-8 relative inline-block">
                        Take Control of Your Finances
                        <div className="absolute -z-10 w-full h-full bg-blue-500/20 blur-3xl"></div>
                    </h1>
                    <p className="text-white text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12">
                        Vorifi helps you track expenses, manage budgets, and achieve your financial goals with
                        powerful tools and intelligent insights.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/sign-up"
                            className="
                                bg-yellow-300
                                text-slate-900
                                px-8
                                py-4
                                rounded-full
                                font-semibold
                                text-lg
                                hover:bg-yellow-400
                                transition-all
                                duration-300
                                transform
                                hover:scale-105
                                shadow-lg
                                hover:shadow-yellow-300/50
                                inline-block
                            "
                        >
                            Get Started
                        </Link>
                    </div>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <div className="rounded-xl overflow-hidden shadow-2xl bg-blue-500/10 backdrop-blur-sm border-2 border-blue-500/20">
                        <div className="relative w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/dashboard.png"
                                alt="Vorifi Dashboard Preview"
                            />
                        </div>
                    </div>
                    <div className="absolute -z-10 inset-0 blur-3xl bg-yellow-300/20"></div>
                </div>
            </div>
        </div>
    );
};

export default Hero;