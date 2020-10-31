import {useState,useEffect} from 'react'
import PrivateContent from '../components/private'
import Layout from '../components/layout'
import {connect} from 'react-redux'
import {API_URI,TOKEN_VAR_NAME,NAV_HEIGHT,ADMIN_PER_PAGE} from '../config'
import {showFixedLoader} from '../redux/actions'
import Player from '@vimeo/player';
function AdminContent(props){
    const [ready,setReady] = useState(false)
    const [error,setError] = useState(false)
    const [totalPage,setTotalPage] = useState(1)
    const [pageNumber,setPageNumber] = useState(1)
    const [videos,setVideos] = useState([])
    const [filestat,setFilestat] = useState(3)
    function getVideos(){
        props.showFixedLoader(true)
        setReady(false)
        setError(false)
        fetch(`${API_URI}/api/admin/videos`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem(TOKEN_VAR_NAME),
            },
            body: JSON.stringify({
                "pageNumber": pageNumber,
                "nPerPage": ADMIN_PER_PAGE,
                "filestat":filestat
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            if(result.status=="OK"){
                console.log('ok')
                setVideos(result.videos.data)
                setTotalPage(result.videos.totalPage)
                
            } else {
                setError(true)
            }
            setReady(true)
            props.showFixedLoader(false)
        }).catch(err=>{
            console.log(err)
            setReady(true)
            setError(true)
            props.showFixedLoader(false)
        })
    }
    function goToPage(pageNumber){
        setPageNumber(pageNumber)
        getVideos()
    }
    function renderPagination(){
        let items = []
        for(let i=1;i<=totalPage;i++){
          items.push(
            <li onClick={()=>goToPage(i)} className={i==pageNumber?"current":""} key={`page_${i}`}>
              <span className="a">{i}</span>
            </li>)
          }
        return (
          <ul>
            {items.map(item=>item)}
          </ul>
        )
    }
    function renderVideos(){
        let col_1 = []
        let col_2 = []
        let col_3 = []
        let col_4 = []
        for(let i=0;i<videos.length;i++){
            if(i%4==0)
                col_1.push(videos[i])
            if((i-1)%4==0)
                col_2.push(videos[i])
            if((i-2)%4==0)
                col_3.push(videos[i])
            if((i+1)%4==0)
                col_4.push(videos[i])
        }
        return (
            <div style="padding:56.25% 0 0 0;position:relative;">
                {/* <iframe src={`https://player.vimeo.com/video/460499447?title=0&byline=0&portrait=0`} style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe> */}
            </div>
            // <div className="row">
            //     <div className="col-md-3">
            //             {col_1.map(video=>{
            //                 return (
            //                     <div key={video.videoid} id={`video_${video.videoid}`}>
            //                         <div style="padding:56.25% 0 0 0;position:relative;">
            //                             <iframe src={`https://player.vimeo.com/video/${video.videoid}?title=0&byline=0&portrait=0`} style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
            //                         </div>
            //                     </div>
            //                 )
            //             })}
            //     </div>
            //     <div className="col-md-3">
            //             {col_2.map(video=>{
            //                     return (
            //                         <div key={video.videoid} id={`video_${video.videoid}`}></div>
            //                     )
            //             })}
            //     </div>
            //     <div className="col-md-3">
            //             {col_3.map(video=>{
            //                     return (
            //                         <div key={video.videoid} id={`video_${video.videoid}`}></div>
            //                     )
            //             })}
            //     </div>
            //     <div className="col-md-3">
            //             {col_4.map(video=>{
            //                     return (
            //                         <div key={video.videoid} id={`video_${video.videoid}`}></div>
            //                     )
            //             })}
            //     </div>
            // </div>
        )
    }
    function player(){
        videos.forEach(video=>{
            let options = {
                id: video.videoid,
                controls:true,
                title:false,
                byline:false,
                responsive:true,
                portrait:false,
            };
            console.log('creating player')
            console.log(video.videoid)
            // var player = new Player(`video_${video.videoid}`, options)
        })
    }
    useEffect(() => getVideos(), [])
    // useEffect(() => player(), [videos])
    return(
        <>
            <div className={`admin-videos ${ready?"show":""}`} style={{minHeight:`calc(${props.common.windowHeight}px - ${NAV_HEIGHT}`}}>
                <div className="container-fluid">
                    <div className="content">
                        <iframe src="https://player.vimeo.com/video/460499447" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
                        {ready && !error &&
                            <div className="videos">
                                <div className="page">Showing page {pageNumber} of {totalPage}</div>
                                <div className="videos">
                                    {renderVideos()}
                                </div>
                                <div className="pagination">
                                    {totalPage > 1 &&
                                        renderPagination()
                                    }
                                </div>
                            </div>
                        }
                        {error && 
                            <div className="error">Could not fetch videos. Please contact tech support.</div>
                        }
                    </div>
                </div>
            </div>
            <style jsx>{`
                .admin-videos{
                    opacity:0;
                    transition:opacity 0.7s;
                }
                .admin-videos.show{
                    opacity:1;
                }
            `}</style>
        </>
    )
}
function mapStateToProps({common}){
    return {common}
}
const ConnectedAdminComponent = connect(mapStateToProps,{showFixedLoader})(AdminContent)
function ParticipantDashboard(){
    return (
        <Layout mainContentPadding={true} navColor="solid"> 
            <PrivateContent>
                <ConnectedAdminComponent />
            </PrivateContent>
        </Layout>
    )
}
export default ParticipantDashboard