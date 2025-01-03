
export default function TooltipRight({children,content}) {
    return (
        <div className="">
            <div className="group relative">
                <div>{children}</div>
                <div className="absolute -right-[200px] top-0 flex cursor-pointer whitespace-nowrap opacity-0 duration-500 hover:hidden group-hover:-right-[220px] group-hover:opacity-100">
                    <div className="h-fit rounded-md bg-action px-3 py-2 text-white shadow-[0px_0px_10px_0px_action] font-semibold">{content}</div>
                    <span className="absolute -left-2 top-[50%] h-0 w-0 -translate-y-1/2 -rotate-[135deg] border-b-[20px] border-r-[20px] border-b-transparent border-r-action shadow-[0px_0px_10px_0px_action]"></span>
                </div>
            </div>
        </div>
    );
}