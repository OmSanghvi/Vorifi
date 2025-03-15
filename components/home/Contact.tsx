import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        emailjs.send("service_brwmb6j", "template_wzpa99n", { ...formData, to_email: "vorifihelp@gmail.com" }, "tlO-kO-0ehTlz0d4z")
            .then((response) => {
                alert("Message sent successfully!");
                window.location.reload();
            })
            .catch((error) => {
                console.log('Form submission error:', error.text);
            });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <section className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 py-20 px-4 -mt-96" id="contact">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-yellow-300 mb-6">
                        Get in Touch
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                        Have questions about Vorifi? We are here to help you manage your finances better.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-blue-500/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-blue-500/20">
                            <h3 className="text-2xl font-bold text-yellow-300 mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Email</p>
                                        <p className="text-gray-200">vorifihelp@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Phone</p>
                                        <p className="text-gray-200">+1 (385) 273-1245</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-500/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-blue-500/20">
                            <h3 className="text-2xl font-bold text-yellow-300 mb-6">Follow Us</h3>
                            <div className="flex space-x-4">
                                {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                                    <a
                                        key={social}
                                        href={`https://${social}.com/vorifi`}
                                        className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-colors duration-300"
                                    >
                                        <span className="text-yellow-300 capitalize">{social[0].toUpperCase()}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="bg-blue-500/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-blue-500/20">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-blue-500/5 border-2 border-blue-500/20 rounded-lg focus:outline-none focus:border-yellow-300 text-gray-200"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-blue-500/5 border-2 border-blue-500/20 rounded-lg focus:outline-none focus:border-yellow-300 text-gray-200"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-gray-300 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-blue-500/5 border-2 border-blue-500/20 rounded-lg focus:outline-none focus:border-yellow-300 text-gray-200 resize-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-yellow-300 text-slate-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300 shadow-lg hover:shadow-yellow-300/50"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;