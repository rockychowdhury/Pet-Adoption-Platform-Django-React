import video from '../../assets/video.mp4'
const BackgroundVideoDiv = () => {
    return (
        <div className="flex-1 h-full">
            <video
                className="inset-0 object-cover h-full object-right rounded-2xl"
                src={video}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
            />
        </div>
    );
};

export default BackgroundVideoDiv;
