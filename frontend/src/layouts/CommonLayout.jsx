import { Outlet } from "react-router";
import Navbar from '../pages/Shared/Navbar/Navbar';
import HeroSection from '../pages/HomePages/HeroSection';

const CommonLayout = () => {
    return (
        <>
            <header className="font-poppins relative bg-primary text-natural">
                <div className="bg-secondary absolute top-0 right-0 w-2/5 h-full"></div>
                <div className="max-w-screen-2xl relative mx-auto ">
                    <Navbar></Navbar>
                </div>
                <section className="pt-10">
                    <HeroSection></HeroSection>
                </section>
            </header>
            <main>
                <Outlet></Outlet>
            </main>
            <footer>

            </footer>
        </>
    );
};

export default CommonLayout;