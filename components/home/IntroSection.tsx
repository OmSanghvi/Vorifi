import React from 'react';

/**
 * A React component that displays a set of feature items using a styled card layout.
 */
class FeatureCard extends React.Component<{
    /**
     * Determines the background color variant of the card (e.g. 'light' or 'dark').
     */
    variant: string;

    /**
     * The title displayed at the top of the card.
     */
    title: any;

    /**
     * An array of feature items to be rendered in the card.
     */
    items: any;
}> {
    /**
     * Provides a default value for the variant prop.
     */
    static defaultProps = { variant: 'light' };

    render() {
        let { variant, title, items } = this.props;
        return (
            <div
                className={`
            rounded-xl
            ${variant === 'light' ? 'bg-blue-500' : 'bg-blue-700'}
            p-8
            w-full
            md:w-[35vw]
            transform
            hover:scale-105
            transition-all
            duration-300
            shadow-[5px_5px_0px_0px_rgba(0,0,0,0.3)]
            hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]
            relative
            before:absolute
            before:content-['']
            before:right-[-12px]
            before:top-[12px]
            before:w-[12px]
            before:h-[calc(100%-12px)]
            before:bg-blue-800
            before:transform
            before:skew-y-[45deg]
            after:absolute
            after:content-['']
            after:bottom-[-12px]
            after:left-[12px]
            after:h-[12px]
            after:w-[calc(100%-12px)]
            after:bg-blue-900
            after:transform
            after:skew-x-[45deg]
        `}
            >
                <h2 className="text-yellow-300 text-2xl font-bold mb-6">{title}</h2>
                {items.map((item: any, i: React.Key | null | undefined) => (
                    <div
                        key={i}
                        className="
                    flex
                    items-center
                    justify-between
                    bg-blue-500/50
                    rounded-lg
                    p-4
                    mb-4
                    transform
                    hover:translate-x-1
                    hover:-translate-y-1
                    transition-transform
                    duration-200
                    shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]
                    hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
                    text-lg
                "
                    >
                        <span className="text-white">{item}</span>
                        <div className="rounded-full bg-blue-400/50 p-2">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
                                <path
                                    fill="currentColor"
                                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                                />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

/**
 * A React functional component that renders an introductory section for 'Vorifi'
 * by showcasing two categories of features using FeatureCard.
 */
const VorifiIntroSection = () => {
    const leftFeatures = [
        "Track daily expenses",
        "Set budget goals",
        "View financial reports",
        "Get AI-powered insights"
    ];

    const rightFeatures = [
        "Connect bank accounts",
        "Import transactions",
        "Export data easily",
        "24/7 support access"
    ];

    return (
        <div className="w-full bg-gradient-to-b from-blue-600 to-blue-800 min-h-screen">
            <div className="w-full px-4 py-24">
                <section className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold text-yellow-300 mb-8 relative inline-block">
                        What is Vorifi?
                        <div className="absolute -z-10 w-full h-full bg-blue-500/20 blur-3xl"></div>
                    </h1>
                    <p className="text-white text-xl md:text-2xl font-semibold max-w-4xl mx-auto leading-relaxed">
                        Are you tired of not knowing how to keep tracking of all your expenses and income you
                        make as it is way too hard to manage it all at once? Vorifi makes this task so much easier
                        and simple without all the hassle.
                    </p>
                </section>

                <section className="flex flex-col md:flex-row justify-center gap-8 md:gap-[5vw] items-center max-w-7xl mx-auto px-4">
                    <FeatureCard variant="light" title="Essential Features" items={leftFeatures} />
                    <FeatureCard variant="dark" title="Advanced Features" items={rightFeatures} />
                </section>
            </div>
        </div>
    );
};

export default VorifiIntroSection;