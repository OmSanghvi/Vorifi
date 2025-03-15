import React from 'react';

const AboutMe = () => {
    return (
        <section className="bg-gradient-to-b from-blue-800 to-blue-800 py-20" id="about">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-yellow-300 mb-6">
                        Why Choose Vorifi?
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
                        Vorifi revolutionizes the way you manage your finances. Our platform combines cutting-edge technology
                        with user-friendly design to provide you with the most comprehensive financial management experience.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {/* Feature Cards */}
                    <div className="bg-blue-500/10 backdrop-blur-sm p-6 rounded-xl border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">
                            Real-time expense tracking and categorization
                        </h3>
                    </div>

                    <div className="bg-blue-500/10 backdrop-blur-sm p-6 rounded-xl border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">
                            Smart budgeting recommendations based on your spending
                        </h3>
                    </div>

                    <div className="bg-blue-500/10 backdrop-blur-sm p-6 rounded-xl border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">
                            Secure data encryption and privacy protection
                        </h3>
                    </div>

                    <div className="bg-blue-500/10 backdrop-blur-sm p-6 rounded-xl border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">
                            Seamless integration with your bank accounts & automatic transactions
                        </h3>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <button className="bg-yellow-300 text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300 shadow-lg hover:shadow-yellow-300/50">
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;