import icon from '../../assets/happy (1).png'
const Caution = () => {
    const catLogo = <figure className='min-w-8'>
        <img className='w-full object-cover object-center' src={icon} alt="" />
    </figure>
    return (
        <div className="font-bold text-3xl flex text-nowrap tracking-wide relative space-x-4 right-2 ps-4 leading-tight py-4 bg-black text-white gap-4 -rotate-2 w-fit border-y-4 border-brand-secondary shadow-lg">
            <p>ADOPTME </p> {catLogo} <p>ADOPTME </p> {catLogo} <p>ADOPTME </p> {catLogo} <p>ADOPTME </p> {catLogo} <p>ADOPTME </p> {catLogo} <p>ADOPTME </p> {catLogo} <p>ADOPTME </p> {catLogo} <p>ADOPTME </p> {catLogo}
        </div>
    );
};

export default Caution;