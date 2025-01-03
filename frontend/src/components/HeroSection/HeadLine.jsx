import { LuArrowUpRight } from "react-icons/lu";
const HeadLine = () => {
    return (
        <div className='text-7xl text-pretty leading-tight tracking-wide font-semibold'>
            Find Your Perfect <br /> Pet <span className='text-action font-extrabold'>Companion</span> <br />
            <div className='flex items-center gap-10'>
                <span>Today</span>
                <button className=' bg-primary rounded-full border-separate text-primary mt-4 flex items-center '>

                    <span className='text-2xl bg-[#AC906E] border-action_dark  ps-8 rounded-full py-4 px-4'>Explore Pets</span>
                    <span className='rounded-full  border-action_dark  bg-[#AC906E] text-6xl -ms-2'>
                        <LuArrowUpRight></LuArrowUpRight>
                    </span>
                </button>
            </div>
        </div>
    );
};

export default HeadLine;