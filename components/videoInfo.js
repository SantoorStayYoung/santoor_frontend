import Link from 'next/link'
import {connect} from 'react-redux'
import {vote} from '../redux/actions'
function VideoInfo(props){
    let {video} = props
    return (
        <>
        <div className="video-info text-center purple">
            <div className="votes-heading light">Votes</div>
            <div className="vote-count">{video.totalVote}</div>
            <div className="vote-now color-inherit-a"><Link href={`/video/[id]`} as={`/video/${video.videoid}`}><a className="underline">Go to video page</a></Link></div>
            <div className="vote-now text-center">
                <button className="btn-primary btn margin-auto" onClick={()=>props.vote(video.videoid)}>Vote</button>
            </div>
        </div>
        <style jsx>{`
            .votes-heading{
                margin-top: 1.5rem;
                font-size: 2.2rem;
            }
            .vote-count{
                font-size: 2.2rem;
            }
            .vote-now{
                margin-top:1rem;
            }
        `}</style>
        </>
    )
}
export default connect(null,{vote})(VideoInfo)