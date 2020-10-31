import {useState,useEffect} from 'react'
import {API_URI,MOBILE_BREAKPOINT} from '../config'
import VideoEmbed from '../components/videoEmbed2'
import { connect } from 'react-redux'
import {showFixedLoader} from '../redux/actions'
import Layout from '../components/layout'
import VideoInfo from '../components/videoInfo'
function Videos(props){
    const [videos,setVideos] = useState([])
    function fetchVideos(){
        props.showFixedLoader(true)
        fetch(`${API_URI}/api/dashboard/all_videos`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({pageNumber: 1,nPerPage: 200,order: "vote"})
          })
          .then(res=>res.json())
          .then(result=>{
              if(result.status=="OK"){
                  console.log('setting videos')
                  console.log(result.videos.data)
                  setVideos(result.videos.data)
              }
              props.showFixedLoader(false)
          }).catch(err=>{
              console.log(err)  
              props.showFixedLoader(false)
          })
    }
    function renderVideos(){
        let col_1 = []
        let col_2 = []
        let col_3 = []
        for(let i=0;i<videos.length;i++){
            if(i%3==0){
                col_1.push(videos[i])
            } 
            if((i-1)%3==0){
                col_2.push(videos[i])
            }
            if((i+1)%3==0){
                col_3.push(videos[i])
            }
        }
        if(window.innerWidth < MOBILE_BREAKPOINT){
            return (
                <div className="row">
                    <div className="col-12">
                        {videos.map(video=>{
                            return (
                                <div className="video" key={video.videoid}>
                                    <VideoEmbed videoid={video.videoid} />
                                    <VideoInfo video={video} />
                                </div>
                            )
                        })}
                    </div>
                    <style jsx>{`
                        .video{
                            margin:3rem 0;
                        }
                    `}</style>
                </div>
            )
        } else {
            return (
                <div className="row">
                    <div className="col-md-4">
                        {col_1.map(video=>{
                            return (
                                <div className="video" key={video.videoid}>
                                    <VideoEmbed videoid={video.videoid} />
                                    <VideoInfo video={video} />
                                </div>
                            )
                        })}
                    </div>
                    <div className="col-md-4">
                        {col_2.map(video=>{
                            return (
                                <div className="video" key={video.videoid}>
                                    <VideoEmbed videoid={video.videoid} />
                                    <VideoInfo video={video} />
                                </div>
                            )
                        })}
                    </div>
                    <div className="col-md-4">
                        {col_3.map(video=>{
                            return (
                                <div className="video" key={video.videoid}>
                                    <VideoEmbed videoid={video.videoid} />
                                    <VideoInfo video={video} />
                                </div>
                            )
                        })}
                    </div>
                    <style jsx>{`
                        .video{
                            margin:3rem 0;
                        }
                    `}</style>
                </div>
            )
        }
    }
    useEffect(()=>{
        fetchVideos()
    },[])
    console.log(videos)
    return (
        <Layout page="videos" navColor="solid" navPosition="relative">
            <div className="videos-page-wrapper">
                {videos.length > 0 &&
                    <div className="videos">
                        <div className="container-fluid">
                            {renderVideos()}
                        </div>
                    </div>
                }
            </div>
            <style jsx>{`
                .videos-page-wrapper{
                    min-height:100vh;
                    background: url(/images/topbg.png);
                }
            `}</style>
        </Layout>
    )
}
export default connect(null,{showFixedLoader})(Videos)