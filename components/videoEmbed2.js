export default function VideoEmbed2(props){
    return (
        <>
        <div className="video-wrap">
                <iframe src={`https://player.vimeo.com/video/${props.videoid}?title=0&byline=0&portrait=0`} frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
        </div>
        <style jsx>{`
            .video-wrap{
                background:#000000;
            }
            .video-wrap iframe{
                width:100%;
            }
        `}</style>
        </>
    )
}