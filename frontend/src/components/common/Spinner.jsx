
const Spinner = () => {
    return (
        <div className='flex items-center w-fit mx-auto mt-10 text-brand-primary font-bold'>
            <div className="relative w-10 h-10 flex items-center justify-center"><div className="w-5 h-5 animate-[ping_2s_linear_infinite] border rounded-full border-brand-primary"></div><div className="w-5 h-5 animate-[ping_2s_linear_3s_infinite] border rounded-full border-brand-primary absolute"></div></div>
            <div>Loading ...</div>
        </div>
    );
};

export default Spinner;