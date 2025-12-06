import React from 'react';
import HeroSection from '../../components/LandingPage/HeroSection';
import FeaturedPets from '../../components/LandingPage/FeaturedPets';
import FeaturesSection from '../../components/LandingPage/FeaturesSection';
import HowItWorks from '../../components/LandingPage/HowItWorks';
import Footer from '../../components/LandingPage/Footer';
import Navbar from '../../components/common/Navbar'; // Assuming Navbar exists or needs to be created
import { Outlet } from 'react-router';

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                {/* If there are child routes (like login/register), render them. Otherwise render landing page content */}
                <Outlet />

                {/* Only show landing page content if we are at root path. 
                    This logic might need adjustment depending on how Routes.jsx is set up.
                    For now, let's assume HomePage is the layout for the landing page.
                */}

                {/* Check if we are exactly at home to render landing sections */}
                {window.location.pathname === '/' && (
                    <>
                        <HeroSection />
                        <FeaturedPets />
                        <FeaturesSection />
                        <HowItWorks />
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;