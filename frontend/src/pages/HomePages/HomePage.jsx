import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "../Shared/Navbar/Navbar";
import HeroSection from './HeroSection';
import Modal from '../../components/common/Modal';
import Logo from "../../components/common/Logo";
import BackgroundVideoDiv from "../../components/common/BackgroundVideoDiv";
import useUIContext from "../../hooks/useUIContext";
import { useEffect } from "react";
const HomePage = () => {
    const {setOpenModal} = useUIContext();
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location);
    if(location.pathname ==='/'){
        setOpenModal(false);
    }
    const callBack = () => {
        navigate('/');
        setOpenModal(false);
    }
    return (
        <section className="font-poppins">
            <header className="font-poppins relative bg-gradient-to-b rounded-t rounded-[100px] from-primary via-primary to-secondary text-natural">
                <div className="bg-gradient-to-t from-secondary to-primary absolute top-0 rounded-[100px] right-0 w-2/5 h-full"></div>
                <div className="max-w-screen-2xl relative mx-auto ">
                    <Navbar></Navbar>
                </div>
                <section className="pt-10">
                    <HeroSection></HeroSection>
                </section>
            </header>
            <main>

            </main>
            <footer>

            </footer>
            <section>
                <Modal color={"secondary"} callBack={() => callBack()}>
                    <div className="flex gap-8 py-10 ">
                        <div className=" w-96  relative ms-10 ">
                            <div className="absolute flex flex-col items-center h-full w-full p-5 justify-between">
                                <Logo></Logo>
                                <h1 className="text-center leading-relaxed font-semibold opacity-70">Every paw <span className="bg-primary px-2 rounded-full">has a story</span>; let yours be the chapter of <span className="bg-primary px-2 rounded-full">love and care</span>  they’ve been waiting for. 🐕💕</h1>
                            </div>
                            <div className="w-32 h-20 bg-secondary border-action_dark absolute rounded-r-full top-52">

                            </div>
                            <BackgroundVideoDiv></BackgroundVideoDiv>
                        </div>
                        <Outlet>
                        </Outlet>
                    </div>
                </Modal>

            </section>
        </section>
    );
};

export default HomePage;