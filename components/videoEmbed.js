export default function VideoEmbed(props){
    return (
        <>
        <div className="video-wrap">
            <iframe src={`https://player.vimeo.com/video/${props.videoid}?title=0&byline=0&portrait=0`} frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
        </div>
        <style jsx>{`
            .video-wrap{
                padding:56.25% 0 0 0;
                position:relative;
                background:#000000;
            }
            .video-wrap iframe{
                position:absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
            }
        `}</style>
        </>
    )
}