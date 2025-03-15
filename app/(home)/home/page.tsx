'use client'
import { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import Contact from "@/components/home/Contact";
import AboutMe from "@/components/home/AboutMe";
import Skills from "@/components/home/Skills";
import VorifiIntroSection from "@/components/home/IntroSection";
import VorifiFeatures from "@/components/home/Features";
import Footer from "@/components/home/Footer";

export default function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="w-full bg-[#151B28]">
            <Navbar />
            <Hero />
            <VorifiIntroSection />
            <AboutMe />
            <VorifiFeatures />
            <Skills />
            <Contact />
            <Footer />
        </main>
    );
}