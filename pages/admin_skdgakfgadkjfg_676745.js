import {Component,useState} from 'react'
import PrivateContent from '../components/private'
import Layout from '../components/layout'
import {connect} from 'react-redux'
import {API_URI,TOKEN_VAR_NAME,NAV_HEIGHT,ADMIN_PER_PAGE} from '../config'
import {showFixedLoader} from '../redux/actions'
import {statuses} from '../data'
import LoadingIcon from '../components/loadingIcon'
import VideoEmbed from '../components/videoEmbed'
function Video(props){
    const [detailsVisible,showDetails] = useState(false)
    const [statusDropdownVisible,showStatusDropdown] = useState(false)
    const [statusChanging,changingStatus] = useState(false)
    const [statusChangeError,setStatusChangeError] = useState(false)
    const [disapproveOptionsVisible,showDisapproveOptions] = useState(false)
    const [disapproveReason,setDisapproveReason] = useState('')
    const [deleteText,setDeleteText] = useState('')
    const [deleting,setDeleting] = useState(false)
    const [deleteOptionsVisible,showDeleteOptions] = useState(false)
    const [deleteError,setDeleteError] = useState(false)
    let currentStatus = statuses.find(status=>status.filestat==props.video.filestat)
    function changeStatus(videoid,status){
        changingStatus(true)
        setStatusChangeError(false) 
        let jsonBody = {videoid,status}
        if(status=="disapprove")
        jsonBody['reason'] = disapproveReason
        fetch(`${API_URI}/api/admin/manage`, {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem(TOKEN_VAR_NAME),
            },
            body: JSON.stringify(jsonBody) 
        })
        .then(res=>res.json())
        .then(result=>{
            if(result.status == "OK"){
                props.videoStatusChange(videoid,status)
            } else {
                setStatusChangeError(true) 
            }
            changingStatus(false)
        }).catch(err=>{
            console.log(err)
            changingStatus(false)
            setStatusChangeError(true)
        })
    }
    function statusLinkClick(videoid,status){
        if(status!="disapprove"){
            changeStatus(videoid,status)
        } else {
            showDisapproveOptions(true)
        }
    }
    function del(){
        if(deleteText=="delete"){
            
        }
    }
    function delImmediately(){
        if(deleteText.toLowerCase()=="delete"){
            setDeleting(true)
            setDeleteError(false)
            fetch(`${API_URI}/api/admin/del_immediately`, {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem(TOKEN_VAR_NAME),
                },
                body: JSON.stringify({videoid:props.video._id}) 
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result)
                if(result.status == "OK"){
                    props.deleteVideo(props.video._id)
                } else {
                    setDeleteError(true)
                }
                setDeleting(false)
            }).catch(err=>{
                console.log(err)
                setDeleting(false)
                setDeleteError(true)
            })
        }
    }
    return (
        <>
            <div key={props.video.videoid} className="video">
                <VideoEmbed videoid={props.video.videoid} />
            </div>
            <div>Votes: {props.video.totalVote}</div>
            {props.video.users_details[0].email}
            <div className="show-details" onClick={()=>showDetails(!detailsVisible)} >Show options and details{detailsVisible?"-":"+"}</div>
            {deleting && 
                <div>deleting..</div>
            }
            {!deleting && 
                <div className={`details-and-options ${detailsVisible?"show":""}`}>
                <div className="details">
                    <div>Name: {props.video.users_details[0].name}</div>
                    <div>Age: {props.video.users_details[0].age}</div>
                    <div>City: {props.video.users_details[0].city}</div>
                    <div>Email: {props.video.users_details[0].email}</div>
                    <div>Phone: {props.video.users_details[0].phone}</div>
                    <div>Facebook: {props.video.users_details[0].facebook}</div>
                    <div>Instagram: {props.video.users_details[0].instagram}</div>
                    <div>Vimeo video id: {props.video.videoid}</div>
                    <div><a href={`https://centrestage2.santoorstayyoung.com/video/${props.video.videoid}`} target="_blank">View video page</a></div>
                </div>
                {!statusChanging &&
                    <div className="change-status">
                            Status: <span className={`status ${currentStatus.code}`}>
                                <span className="current-status" onClick={()=>showStatusDropdown(!statusDropdownVisible)}>{currentStatus.text}</span>
                                <ul className={`status-dropdown ${statusDropdownVisible?"show":""}`}>
                                        <>
                                            {statuses.map(stat=>{
                                                if(stat.filestat!=currentStatus.filestat)
                                                    return <li onClick={()=>{statusLinkClick(props.video._id,stat.code);showStatusDropdown(false)}} className={stat.code}>{stat.text}</li>
                                            })}
                                        </>    
                                </ul>
                            </span> 
                            <div className={`disapprove-options ${disapproveOptionsVisible?"show":""}`}>
                                <label>Disapprove this video <span className="cursor-pointer underline" onClick={()=>showDisapproveOptions(false)}>(hide)</span></label>
                                <textarea placeholder="reason" className="form-control" value={disapproveReason} onChange={(e)=>setDisapproveReason(e.target.value)}></textarea>
                                <button type="button" className="btn btn-primary" onClick={()=>changeStatus(props.video._id,"disapprove")}>Submit</button>
                            </div>
                            {statusChangeError &&
                                <div className="status-change-error error">
                                    Could not change status.
                                </div>
                            }
                    </div>
                }
                {statusChanging && 
                    <LoadingIcon width="2.2rem" height="2.2rem" centered={true} show={true} weight="thin" /> 
                }
                <div className="delete cursor-pointer" onClick={()=>showDeleteOptions(!deleteOptionsVisible)}>Delete {deleteOptionsVisible?"-":"+"}</div>
                <div className={`delete-options ${deleteOptionsVisible?"show":""}`}>
                    <input type="text" placeholder="type delete" className="delete-text" value={deleteText} onChange={(e)=>setDeleteText(e.target.value)} />
                    {/* <div style={{margin:"1rem 0"}}>
                        <button className={`btn btn-delete btn-orange ${deleteText.toLowerCase()=="delete"?"":"disabled"}`} placeholder="type delete" onClick={()=>del()}>Delete(Undo option to user)</button>
                    </div> */}
                    <div style={{margin:"1rem 0"}}>
                        <button className={`btn btn-delete-immediately btn-red ${deleteText.toLowerCase()=="delete"?"":"disabled"}`} onClick={()=>delImmediately()}>Delete Immediately</button>
                    </div>
                    {deleteError &&
                        <div className="error">Could not delete video.</div>
                    }
                </div>
            </div>
            }
            <style jsx>
                {`
                    .delete-options{
                        display:none;
                    }
                    .delete-options.show{
                        display:block;
                    }
                    // .video{
                    //     padding:56.25% 0 0 0;
                    //     position:relative;
                    //     margin:2rem 0;
                    // }
                    // .video iframe{
                    //     position:absolute;
                    //     top:0;
                    //     left:0;
                    //     width:100%;
                    //     height:100%;
                    // }
                    .show-details{
                        cursor:pointer;
                    }
                    .details-and-options{
                        display:none;
                    }
                    .details-and-options.show{
                        display:block;
                        padding:5%;
                    }
                    .status {
                        font-size: 1.2rem;
                        color: #ffffff;
                        position:relative;
                        display:inline-block;
                        min-width:8rem;
                        text-align:center;
                    }
                    .status-dropdown{
                        position: absolute;
                        top: 2.8rem;
                        z-index: 1;
                        width: 100%;
                        padding-left: 0;
                        text-align: center;
                        list-style: none;
                        left: 0;
                        max-height:0;
                        overflow:hidden;
                    }
                    .status:not(.initiated) .current-status{
                        cursor:pointer;
                    }
                    .current-status{
                        padding: 0.5rem;
                        display:inline-block;
                    }
                    .status-dropdown.show{
                        max-height:10rem;
                    }
                    .status-dropdown li{
                        padding:0.5rem;
                        cursor:pointer;
                    }
                    .waiting_for_approval {
                        background: #eacd00;
                    }
                    .disapprove{
                        background:#bf1200;
                    }
                    .approve{
                        background:#00bf79;
                    }
                    .disapprove-options{
                        display:none;
                        margin:1.5rem 0;
                    }
                    .disapprove-options.show{
                        display:block;
                    }
                `}
            </style>
        </>
    )
}
class AdminContent extends Component{
    constructor(props){
        super(props)
        this.state = {
            videos:[],
            ready:false,
            error:false,
            pageNumber:1,
            totalPage:1,
            filestat:3,
            tab:"waiting"
        }
    }
    getVideos = ()=>{
        this.props.showFixedLoader(true)
        this.setState({ready:false,error:false})
        let jsonBody = {
            "pageNumber": this.state.pageNumber,
            "nPerPage": ADMIN_PER_PAGE,
        }
        if(this.state.tab=="waiting"){
            jsonBody['filestat'] = 3
        }
        if(this.state.tab=="approved"){
            jsonBody['filestat'] = 4
        }
        if(this.state.tab=="disapproved"){
            jsonBody['filestat'] = 5
        }
        if(this.state.tab=="delrequests"){
            jsonBody['delrequest'] = 1
        }
        fetch(`${API_URI}/api/admin/videos`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem(TOKEN_VAR_NAME),
            },
            body: JSON.stringify(jsonBody)
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            if(result.status=="OK"){
                console.log('ok')
                this.setState({videos:result.videos.data,totalPage:result.videos.totalPage})
            } else {
                this.setState({error:true})
            }
            this.setState({ready:true})
            this.props.showFixedLoader(false)
        }).catch(err=>{
            console.log(err)
            this.setState({ready:true,error:true})
            this.props.showFixedLoader(false)
        })
    }
    goToPage = (pageNumber)=>{
        this.setState({pageNumber},()=>{
          this.getVideos()
        })
    }
    renderPagination = ()=>{
        let items = []
        for(let i=1;i<=this.state.totalPage;i++){
          items.push(
            <li onClick={()=>this.goToPage(i)} className={i==this.state.pageNumber?"current":""} key={`page_${i}`}>
              <span className="a">{i}</span>
            </li>)
          }
        return (
          <ul>
            {items.map(item=>item)}
          </ul>
        )
    }
    videoStatusChange = (videoid,status)=>{
        let videos = JSON.parse(JSON.stringify(this.state.videos))
        let i = videos.findIndex(video=>video._id==videoid)
        if(i>-1)
        videos.splice(i,1)
        this.setState({videos})
    }
    deleteVideo = (videoid)=>{  
        let videos = JSON.parse(JSON.stringify(this.state.videos))
        let i = videos.findIndex(video=>video._id==videoid)
        if(i>-1)
        videos.splice(i,1)
        this.setState({videos})
    }
    renderVideos = ()=>{
        let col_1 = []
        let col_2 = []
        let col_3 = []
        let col_4 = []
        for(let i=0;i<this.state.videos.length;i++){
            if(i%4==0)
                col_1.push(this.state.videos[i])
            if((i-1)%4==0)
                col_2.push(this.state.videos[i])
            if((i-2)%4==0)
                col_3.push(this.state.videos[i])
            if((i+1)%4==0)
                col_4.push(this.state.videos[i])
        }
        return (
                <div className="row">
                    <div className="col-md-3">
                            {col_1.map(video=>{
                                return (
                                    <Video video={video} deleteVideo={this.deleteVideo} videoStatusChange={(videoid,status)=>this.videoStatusChange(videoid,status)} />
                                )
                            })}
                    </div>
                    <div className="col-md-3">
                            {col_2.map(video=>{
                                    return (
                                        <Video video={video} deleteVideo={this.deleteVideo} videoStatusChange={(videoid,status)=>this.videoStatusChange(videoid,status)} />
                                    )
                            })}
                    </div>
                    <div className="col-md-3">
                            {col_3.map(video=>{
                                    return (
                                        <Video video={video} deleteVideo={this.deleteVideo} videoStatusChange={(videoid,status)=>this.videoStatusChange(videoid,status)} />
                                    )
                            })}
                    </div>
                    <div className="col-md-3">
                            {col_4.map(video=>{
                                    return (
                                        <Video video={video} deleteVideo={this.deleteVideo} videoStatusChange={(videoid,status)=>this.videoStatusChange(videoid,status)} />
                                    )
                            })}
                    </div>
                </div>
        )
    }
    tabClick = (tab)=>{
        this.setState({tab},()=>{
            this.getVideos()
        })
    }
    componentDidMount(){
        this.getVideos()
    }
    render(){
        return (
            <>
                <div className={`admin`} style={{minHeight:`calc(${this.props.common.windowHeight}px - ${NAV_HEIGHT}`}}>
                    <div className="container-fluid">
                        <div className="filters">
                            <ul>
                                <li className={this.state.tab=="waiting"?"selected":""} onClick={()=>this.tabClick("waiting")}>Waiting for approval</li>
                                <li className={this.state.tab=="approved"?"selected":""} onClick={()=>this.tabClick("approved")}>Approved</li>
                                <li className={this.state.tab=="disapproved"?"selected":""} onClick={()=>this.tabClick("disapproved")}>Disapproved</li>
                                <li className={this.state.tab=="delrequests"?"selected":""} onClick={()=>this.tabClick("delrequests")}>Deletion requests</li>
                            </ul>
                            
                                <span className="filter-option inline-element">
                                    State: <select>
                                        <option>All</option>
                                        <option>Karnataka</option>
                                    </select>
                                </span>
                                <span className="filter-option inline-element">
                                    Sort by: <select>
                                        <option>Latest on top</option>
                                        <option>Highest votes first</option>
                                        <option>Earlier on top</option>
                                    </select>
                                </span>
                            
                            
                        </div>
                        <div className={`content ${this.state.ready?"show":""}`}>
                            {this.state.ready && !this.state.error &&
                                <div className="videos-wrapper">
                                    <div className="page">Showing page {this.state.pageNumber} of {this.state.totalPage}</div>
                                    <div className="videos">
                                        {this.renderVideos()}
                                    </div>
                                    <div className="pagination">
                                        {this.state.totalPage > 1 &&
                                            this.renderPagination()
                                        }
                                    </div>
                                </div>
                            }
                            {this.state.error && 
                                <div className="error">Could not fetch videos. Please contact tech support.</div>
                            }
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .admin{
                        opacity:1;
                        transition:opacity 0.7s;
                        padding: 5rem 2.5%;
                    }
                    .admin.show{
                        opacity:1;
                    }
                    .content{
                        opacity:0;
                        transition:opacity 0.7s;
                    }
                    .content.show{
                        opacity:1;
                    }
                    .filters{
                        margin-bottom:2rem;
                    }
                    .filters ul{
                        list-style:none;
                        padding-left:0;
                    }
                    .filters ul li{
                        display:inline-block;
                        padding:0.5rem 2.5rem;
                        margin-left:-2.5rem;
                        cursor:pointer;
                    }
                    .filters ul li.selected{
                        font-family:NexaBold, sans-serif;
                    }
                    .filter-option{
                        margin-right:2.5rem;
                    }
                `}</style>
            </>
        )
    }
}
function mapStateToProps({common}){
    return {common}
}
const ConnectedAdminComponent = connect(mapStateToProps,{showFixedLoader})(AdminContent)
function ParticipantDashboard(){
    return (
        <Layout navColor="solid" navPosition="relative" page="admin"> 
            <PrivateContent>
                <ConnectedAdminComponent />
            </PrivateContent>
        </Layout>
    )
}
export default ParticipantDashboard