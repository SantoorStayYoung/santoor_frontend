import { connect } from 'react-redux';
import {NAV_HEIGHT,SITE_URL,API_URI,TOKEN_VAR_NAME} from '../../config'
import { useEffect, useState } from 'react';
import Layout from '../../components/layout'
import VideoEmbed from '../../components/videoEmbed'
import {showFixedLoader,vote} from '../../redux/actions'
import isEmpty from 'lodash/isEmpty'
import Share from '../../components/share'
function ParticipantVideo(props){
    const [error,setError] = useState(false)
    const [success,setSuccess] = useState(false)
    const [video,setVideo] = useState({})
    useEffect(()=>{
        //get the video
        props.showFixedLoader(true)
        fetch(`${API_URI}/api/dashboard/all_videos`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                "pageNumber":1,
                "nPerPage":10,
                "videoid":props.videoid
            })
        })
        .then(res=>res.json())
        .then(result=>{
            if(result.status=="OK"){
                if(isEmpty(result.videos))
                    setError(true)
                else{
                    setVideo(result.videos)
                    setSuccess(true)
                }
            } else {    
                setError(true)
            }
            props.showFixedLoader(false)
        }).catch(err=>{
            console.log(err)
            setError(true)
            props.showFixedLoader(false)
        })
    },[])
    return(
        <Layout navColor="solid" navPosition="relative"> 
            <div className="max-width-content video-page" style={{minHeight:`calc(${props.common.windowHeight}px - ${NAV_HEIGHT}`}}>         
                {success && 
                    <div>
                        <VideoEmbed videoid={video.videoid} />
                        <div className="content">
                            <div className="participant-name text-center purple bold">
                                {video.users_details[0].name}
                            </div> 
                            <div className="video-stats purple text-center">
                                <div className="views stat-item">
                                    <div className="stat-heading">
                                        Total Views
                                    </div>
                                    <div className="stat-count bold">
                                        {video.plays}
                                    </div>
                                </div>
                                <div className="votes stat-item">
                                    <div className="stat-heading">
                                        Total Votes
                                    </div>
                                    <div className="stat-count bold">
                                        {video.totalVote}
                                    </div>
                                </div>
                            </div>
                            <div className="share-entry-title text-center">Share the video</div>
                            <Share url={`${SITE_URL}/video/${video.videoid}`}/>
                            <div className="text-center" style={{marginTop:"3rem"}}>
                                <button type="button" className="btn btn-primary btn-larger margin-auto" onClick={()=>props.vote(video.videoid)}><span>VOTE</span></button>
                            </div>
                        </div>
                    </div>
                }
                {error && 
                    <div>Could not fetch video</div>
                }
            </div>
            <style jsx>{`
                .video-page{
                    padding-top:2.5rem;
                }
                .content{
                    padding-left:5%;
                    padding-right:5%;
                    padding-bottom:5rem;
                }
                .content:focus{
                    outline:none;
                }
                .participant-name{
                    padding-top:3rem;
                    padding-bottom:3rem;
                    text-transform:uppercase;
                }
                .participant-video{
                    position: relative;
                    padding-bottom: 56.25%;
                    height: 0; overflow: hidden;
                    max-width: 100%; height: auto;
                }
                .participant-video iframe{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .share-options{
                    // display:flex;
                    // flex-flow:row wrap;
                    text-align:center;
                }
                .share-entry-title{
                    margin:2.5rem 0;
                }
                .share-icons .share-icon:first-child{
                    margin-left:1rem;
                }
                .share-icon{
                    background: #F3F3F3;
                    padding: 1.1rem;
                    margin: 0 0.5rem;
                    display: inline-block;
                }
                .share-icon-whatsapp{
                    padding:0.6rem;
                }
                .share-icon img{width:20px}
                .share-icon-whatsapp img{
                    width:30px;
                }
                .copy-link{                
                    border: 1px solid #afadad;
                    padding: 0.7rem 1rem;
                    width: calc(100% - 17rem);
                    position: relative;
                    text-align: left;
                    display: inline-block;
                    line-height: 1.9;
                }
                .copy-link-label {
                    color: #53284F;
                    font-size: 1.2rem;
                    margin-top: 0.3rem;
                    cursor: pointer;
                    position: absolute;
                    right: 0.5rem;
                    top: 0.7rem;
                }
                .link{
                    width: 50%;
                    overflow: scroll;
                    display: flex;
                    flex-flow: row nowrap;
                    color: #918F8F;
                    width: calc(100% - 10rem);
                }
                .request-removal{
                    margin: 4rem 0 1.5rem 0;
                }
                .request-removal-form{
                    margin-top:2rem;
                }
                .request-removal-form .form-control{
                    width:100%;
                }
                .request-removal-form{
                    max-height:0;
                    overflow:hidden;
                    transition:max-height .4s cubic-bezier(0.165, 0.840, 0.440, 1.000);
                }
                .request-removal-form.show{
                    max-height:50rem;
                    transition:max-height .4s cubic-bezier(0.165, 0.840, 0.440, 1.000);
                }
                .stat-item{
                    display:inline-block;
                    font-size:2rem;
                }
                .votes{
                    margin-left:5rem;
                }
            `}</style>
        </Layout>
    )
}
ParticipantVideo.getInitialProps = async (ctx) => {
    return { videoid: ctx.query.id }
}
function mapStateToProps({common,auth}){
    return {common,auth}
}
export default connect(mapStateToProps,{showFixedLoader,vote})(ParticipantVideo)