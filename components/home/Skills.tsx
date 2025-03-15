import React from 'react';
import { FaMoneyBillWave, FaReceipt, FaChartBar, FaTachometerAlt, FaUniversity, FaChartLine } from 'react-icons/fa';

/**
 * SkillCard component
 *
 * @param {Object} props - Component properties
 * @param {string} props.title - The title of the skill
 * @param {string} props.description - The description of the skill
 * @param {React.ComponentType} props.Icon - The icon representing the skill
 * @returns {JSX.Element} The rendered SkillCard component
 */
const SkillCard = ({ title, description, Icon }: { title: string; description: string; Icon: React.ComponentType }) => (
    <div className="
        bg-blue-500/10
        backdrop-blur-sm
        p-6
        rounded-xl
        transform
        hover:scale-105
        transition-all
        duration-300
        border-2
        border-blue-500/20
        hover:border-blue-500/40
        group
    ">
        <div className="flex items-start gap-4">
            <div className="
                p-3
                bg-blue-500
                rounded-lg
                text-white
                shadow-lg
                group-hover:shadow-blue-500/50
                transition-all
                duration-300
            ">
                <Icon/>
            </div>
            <div>
                <h3 className="text-xl font-bold text-blue-500 mb-2">{title}</h3>
                <p className="text-gray-200 leading-relaxed">{description}</p>
            </div>
        </div>
    </div>
);

/**
 * Skills component
 *
 * @returns {JSX.Element} The rendered Skills component
 */
const Skills = () => {
    const skills = [
        {
            title: "Expense Tracking",
            description: "Easily track all your daily expenses and categorize them for better financial management.",
            Icon: FaMoneyBillWave,
        },
        {
            title: "Receipt Tracking",
            description: "Add any receipts and convert them into transactions.",
            Icon: FaReceipt,
        },
        {
            title: "Financial Insights",
            description: "Get detailed analytics and insights from our AI about your spending patterns and habits.",
            Icon: FaChartBar,
        },
        {
            title: "Comprehensive Dashboard",
            description: "Comprehensive graphs and charts to represent your financial situation.",
            Icon: FaTachometerAlt,
        },
        {
            title: "Bank Account Connection",
            description: "Connecting your bank account to automatically import transactions.",
            Icon: FaUniversity,
        },
        {
            title: "Stocks Watchlist",
            description: "View different stocks and their current market value.",
            Icon: FaChartLine,
        }
    ];

    return (
        <section className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-800 py-20 px-4" id="Skills">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-yellow-300 mb-6">
                        Our Features
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
                        Discover the powerful features that make Vorifi your perfect companion for financial management
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skills.map((skill, index) => (
                        <SkillCard
                            key={index}
                            title={skill.title}
                            description={skill.description}
                            Icon={skill.Icon}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;