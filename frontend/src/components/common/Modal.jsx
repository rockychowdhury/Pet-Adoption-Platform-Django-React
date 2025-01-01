import PropTypes from 'prop-types';
import useUIContext from '../../hooks/useUIContext';
import { IoClose } from "react-icons/io5";
const Modal = ({color, children,callBack }) => {
    const { openModal } = useUIContext();
    return (
        // NavigateUI Modal
        
        <div className="mx-auto w-fit">
            <div onClick={() => callBack()} className={`fixed z-[100] w-screen ${openModal ? 'visible opacity-100' : 'invisible opacity-0'} inset-0 grid place-items-center bg-black/20 backdrop-blur-md duration-100 `}>
                <div onClick={(e_) => e_.stopPropagation()} className={`absolute w-fit rounded-lg bg-${color} p-6 drop-shadow-lg ${openModal ? 'opacity-1 duration-300' : 'scale-110 opacity-0 duration-150'}`}>
                    <button onClick={() => callBack()} className="absolute text-2xl right-3 top-3 p-2  text-action border border-action_dark shadow-sm rounded-full">
                        <IoClose></IoClose>
                    </button>
                    <div className='lg:pe-10 '>
                        {
                            children
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
Modal.propTypes = {
    children: PropTypes.any,
    callBack: PropTypes.func
}
export default Modal;