import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const VorifiFeatures = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            src: "/dashboard.png", // Replace with actual images
            alt: "Dashboard View",
            title: "Comprehensive Dashboard",
            description: "Get a complete overview of your finances at a glance"
        },
        {
            src: "/transactions.png",
            alt: "Transactions View",
            title: "Smart Transactions",
            description: "Track and categorize your spending automatically"
        },
        {
            src: "/analytics.png",
            alt: "Analytics View",
            title: "Deep Analytics",
            description: "Understand your financial patterns with detailed insights"
        }
    ];

    const rotateSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const getPreviousIndex = () => {
        return (currentSlide - 1 + slides.length) % slides.length;
    };

    const getNextIndex = () => {
        return (currentSlide + 1) % slides.length;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-800 to-slate-800 flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-300/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full py-24 relative z-10">
                <section className="text-center max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl md:text-6xl font-bold text-yellow-300 mb-6 relative inline-block">
                        Powerful Features
                        <div className="absolute -z-10 w-full h-full bg-blue-500/20 blur-3xl"></div>
                    </h2>
                    <p className="text-white text-lg md:text-xl max-w-3xl mx-auto mb-12">
                        Make sure to check out all of the available features. Connect your bank account with Plaid,
                        seamlessly connect online bank CSV documents, secure authentication and back-end
                        connection, and gain expert financial advice through our exclusive AI chat bot.
                    </p>

                    <div className="relative overflow-hidden px-12 mb-12">
                        <div className="flex items-center justify-center min-h-[400px]">
                            {/* Previous Slide */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 transform opacity-30 transition-all duration-500 w-[300px]">
                                <div className="rounded-xl overflow-hidden shadow-lg">
                                    <img
                                        src={slides[getPreviousIndex()].src}
                                        alt={slides[getPreviousIndex()].alt}
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>

                            {/* Current Slide */}
                            <div className="transform transition-all duration-500 z-10 w-[600px]">
                                <div className="rounded-xl overflow-hidden shadow-2xl bg-blue-500/10 backdrop-blur-sm border-2 border-blue-500/20">
                                    <img
                                        src={slides[currentSlide].src}
                                        alt={slides[currentSlide].alt}
                                        className="w-full h-auto"
                                    />
                                    <div className="p-6 text-center">
                                        <h3 className="text-2xl font-bold text-yellow-300 mb-2">
                                            {slides[currentSlide].title}
                                        </h3>
                                        <p className="text-white">
                                            {slides[currentSlide].description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Next Slide */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 transform opacity-30 transition-all duration-500 w-[300px]">
                                <div className="rounded-xl overflow-hidden shadow-lg">
                                    <img
                                        src={slides[getNextIndex()].src}
                                        alt={slides[getNextIndex()].alt}
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slide Indicators */}
                    <div className="space-x-2 mb-8">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    currentSlide === index ? 'bg-yellow-300 w-8' : 'bg-blue-300'
                                }`}
                                onClick={() => setCurrentSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    <h3 className="text-3xl font-bold text-blue-300 mb-8">Seamless financial overview</h3>
                    <button
                        onClick={rotateSlide}
                        className="
                            bg-yellow-300
                            text-slate-900
                            px-8
                            py-4
                            rounded-full
                            font-semibold
                            flex
                            items-center
                            mx-auto
                            hover:bg-yellow-400
                            transition-all
                            duration-300
                            transform
                            hover:scale-105
                            shadow-lg
                            hover:shadow-yellow-300/50
                        "
                    >
                        Show me more
                        <ChevronRight className="ml-2 w-6 h-6" />
                    </button>
                </section>
            </div>
        </div>
    );
};

export default VorifiFeatures;