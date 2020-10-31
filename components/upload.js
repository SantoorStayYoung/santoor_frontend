import {useDropzone} from 'react-dropzone';
import { connect } from 'react-redux';
import { useState } from 'react';
import {API_URI,TOKEN_VAR_NAME,NAV_HEIGHT,TOTAL_POLL_COUNT,POLL_INTERVAL} from '../config'
import LoadingIcon from './loadingIcon'
import { Player } from 'video-react';
import isEmpty from 'lodash/isEmpty'
import UploadingIcon from '../components/uploadingIcon'
const axios = require('axios');
let CancelToken = axios.CancelToken;
let source = CancelToken.source();
import Modal from '../components/modal'
import Terms from '../components/terms'
import ContactForm from '../components/contactForm'
import VideoEmbed from '../components/videoEmbed'
function Upload(props){
    const [contactFormVisible,showContactForm] = useState(false)
    const [termsVisible,showTerms] = useState(false)
    const [file,setFile] = useState(null)
    const [agreed,setAgreed] = useState(false)
    const [loading,setLoading] = useState(false)
    const [uploadError,setUploadError] = useState(false)
    const [percentComplete,setPercentComplete] = useState(0)
    const [fileRejected,setFileRejected] = useState(false)
    let poll = null
    let pollCount = 0
    const {getRootProps, getInputProps} = useDropzone({
        maxSize:100000000,
        multiple:false,
        accept:['video/*','video/mp4','video/x-m4v','video/mov','video/avi'],
        onDropAccepted,
        onDropRejected
    })
    function onDropAccepted(files){
            setFile(null)
            setFileRejected(false)
            var fileReader = new FileReader();
            fileReader.onload = function() {
                var blob = new Blob([fileReader.result], {type: files[0].type});
                files[0].temp_video_url = URL.createObjectURL(blob);
                setFile(files[0])
            };
            fileReader.readAsArrayBuffer(files[0]);
    }
    function onDropRejected(file){
        setFileRejected(true)
    }
    function startPollingForUpdates(){
        //poll every 1 minute 20 times
        poll = setInterval(()=>{
            fetch(`${API_URI}/api/dashboard/status`, {
                method: 'GET',
                headers: {
                    "auth-token": localStorage.getItem(TOKEN_VAR_NAME),
                }
            })
            .then(res=>res.json())
            .then(result=>{
                if(result.status=="OK"){
                    if(isEmpty(result.videos)){
                        props.set({status:"new"})
                    }
                    else{
                        props.set({status:result.videos.filestat,info:result.videos})
                        if(result.videos.filestat==2 || result.videos.filestat==4 ||result.videos.filestat==5||result.videos.filestat==6)
                        clearInterval(poll)
                    }
                }
            }).catch(err=>{
                console.log(err)
            })
            pollCount++
            if(pollCount == TOTAL_POLL_COUNT)
            clearInterval(poll)
        },POLL_INTERVAL)
    }
    function uploadVideo(){
        if(file && agreed){
            setLoading(true)
            setUploadError(false)
            let formData = new FormData()
            formData.append('vid', file)
            CancelToken = axios.CancelToken;
            source = CancelToken.source();
            const config = {
                onUploadProgress: function(progressEvent) {
                    var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                    setPercentComplete(percentCompleted)
                },
                headers: {
                    "auth-token": localStorage.getItem(TOKEN_VAR_NAME),
                },
                cancelToken: source.token
            }
            axios.post(`${API_URI}/api/video/submit`,formData,config)
            .then(response => {
                if(response.status==200){
                    props.set({status:0})
                    startPollingForUpdates();
                } else {
                    setUploadError(true)
                }
                setLoading(false)
            })
            .catch(error => {
                if(error.message!="cancel")
                setUploadError(true)
                setLoading(false)
            })
        }
    }
    function cancelClick(){
        setLoading(false)
        source.cancel('cancel')
    }
    function tryAgain(){
        setFile(null)
        props.set({status:"new"})
    }
    function close(){
        showTerms(false)
        showContactForm(false)
    }
    return(
        <>
            <Modal show={contactFormVisible} close={close}>
                <ContactForm />
            </Modal>
            <Modal show={termsVisible} close={close}>
                <div className="text-left">
                    <Terms />
                </div>
            </Modal>
            <div className="max-width-content content" {...getRootProps({className: 'dropzone'})} style={{minHeight:`calc(${props.common.windowHeight}px - ${NAV_HEIGHT}`}}>       
                <div className="top">
                    <h1 className="purple">UPLOAD VIDEO</h1>
                </div>
                {(props.status=="new" || props.status=="7" || props.status=="8") &&
                    <div className="new-video">
                        <input {...getInputProps()} />
                        {}
                        {!file && 
                            <div>
                                <div style={{fontSize:"2rem",letterSpacing:"1.4px",marginTop:"4rem"}}>It's time to share your talent</div>
                                <img src="/images/feather-upload-cloud.svg" className="cursor-pointer" style={{width:"68px",marginTop:"3rem"}}/>
                                <div style={{marginTop:"4rem"}}>Drag 'n' drop or click here to upload.</div>
                                {/* <div>For guidance on how to make a video <span className="underline">Click here</span></div> */}
                                {fileRejected && 
                                    <div className="file-rejected error">Invalid file format or too large. Please try again.</div>
                                }
                                <div onClick={(e)=>e.stopPropagation()}>
                                    <h2 className="purple" style={{fontSize:"1.4rem",letterSpacing:"1.4px",marginTop:"4rem",marginBottom:"2rem"}}>HOW TO PARTICIPATE</h2>
                                    <VideoEmbed videoid="464469350" />
                                </div>
                            </div>
                        }
                        {file && 
                            <div className="preview-and-upload position-relative" onClick={(e)=>e.stopPropagation()}>
                                {loading &&
                                    <div className="uploading">
                                        <div className="uploading-icon">
                                            <UploadingIcon />
                                            <div className="text-orange percent-complete">{percentComplete}%</div>
                                            <div className="text-orange cancel-upload cursor-pointer"><span onClick={()=>cancelClick()}>x Cancel</span></div>
                                        </div>
                                    </div>
                                }
                                <div className="preview-video-wrapper">
                                    <video width="560" className="preview-video" controls>
                                        <source src={file.temp_video_url} />
                                    </video>
                                    {/* <Player
                                        playsInline
                                        src={file.temp_video_url}
                                    /> */}
                                </div>
                                <div className="video-details text-right">
                                        <span className="cursor-pointer" onClick={()=>{setFile(null);setAgreed(false)}}>x Remove</span>
                                </div>
                                <div style={{marginTop:"3rem"}}>
                                    <span onClick={()=>setAgreed(!agreed)}><input type="checkbox" checked={agreed?true:false}/> I have verified that this is the video I want to upload and agree to the <span className="bold cursor-pointer underline" onClick={()=>showTerms(true)}>terms and conditions</span>.</span>
                                </div>
                                <div style={{marginTop:"3rem"}} className="text-center">
                                    <button type="button" className={`btn btn-primary btn-larger margin-auto ${!agreed?"disabled":""}`} onClick={()=>uploadVideo()}>Upload</button>
                                </div>
                                {uploadError &&
                                    <div style={{marginTop:"1rem"}} className="error">
                                        Failed to upload. If you are facing issues, <span className="cursor-pointer underline" onClick={()=>showContactForm(true)}>please let us know</span>.
                                    </div>
                                }
                            </div>
                        }
                    </div>
                }
                {(props.status==0 || props.status==1) &&
                    <div className="middle">
                        <img src="/images/upload-circle.svg" className="status-img" />
                        <div className="status-text">Your video was submitted successfully. We will notify you on your registered email id when we're done processing.</div>
                    </div>
                }
                {(props.status==2) &&
                    <div className="middle">
                        <img src="/images/processing_error.svg" className="status-img" />
                        <div className="status-heading"><img src="/images/sad.svg" className="sad-img inline-element"/> <span className="purple bold inline-element sorry-text">Sorry!</span></div>
                        <div className="status-text">There was an error processing your video. Please ensure you have followed all competition guidelines.</div>
                        <div className="try-again"><span className="cursor-pointer underline a" onClick={()=>tryAgain()}>Try again</span></div>
                    </div>
                }
                {(props.status==3) &&
                    <div className="middle">
                        <img src="/images/uploading-done-2.gif" className="status-img" />
                        <div className="status-heading"><img src="/images/confetti.svg" className="confetti-img confetti-img-left inline-element"/><span className="purple bold inline-element">Congratulations!</span><img src="/images/confetti.svg" className="confetti-img confetti-img-right inline-element"/></div>
                        <div className="status-text">Your video was processed successfully. Awaiting admin approval.</div>
                    </div>
                }
                {(props.status==5) &&
                    <div className="middle">
                        <img src="/images/cancel.svg" className="status-img" />
                        <div className="status-text">Your video was disapproved by the admin for the following reasons:</div>
                        <div className="disapprove-reason">{props.info.reason}</div>
                        <p><span className="cursor-pointer underline" onClick={()=>tryAgain()}>Try again</span></p>
                    </div>
                }
                {(props.status==6) &&
                    <div className="middle">
                        <img src="/images/processing_error.svg" className="status-img" />
                        <div className="status-text">The video uploaded was too long. It must be less than 90 seconds.</div>
                        <div className="try-again"><span className="cursor-pointer underline" onClick={()=>tryAgain()}>Try again</span></div>
                    </div>
                }
                {/* {(props.status=="new" || props.status=="7" || props.status=="8") &&
                    <div className="bottom">
                        <div className="light-grey-text terms">By uploading your video to this site, you agree to the <span className="bold cursor-pointer underline" onClick={()=>showTerms(true)}>terms &amp; conditions</span> of the contest and give all rights to Santoor to promote your video on its website and social media pages.</div>
                    </div>
                } */}
            </div>
            <style jsx>{`
                .content{
                    // display:flex;
                    // flex-direction:column;
                    height:100%;
                    padding-left:5%;
                    padding-right:5%;
                    min-height:100%;
                }
                .content:focus{
                    outline:none;
                }
                // .top,.bottom,.middle{
                //     flex-grow:1;
                // }
                .top{
                    padding-top:7rem;
                }
                .middle{
                    //min-height:calc(0.7 * (${props.common.windowHeight}px - ${NAV_HEIGHT}));
                    // display:flex;
                    // flex-direction: column;
                    // justify-content: center;
                    margin-top:4rem;
                }
                .bottom{
                    margin-top: 10rem;
                }
                .preview-video{
                    max-width:100%;
                }
                .preview-and-upload{
                    padding:3rem 0;
                }
                .video-details{
                    width:560px;
                    margin:0.25rem auto;
                    max-width:100%;
                }
                .file-name{
                    word-break: break-word;
                    width:100%;
                }
                .terms{
                    margin-top:2rem;
                }
                .uploading{
                    position:absolute;
                    top:0;
                    z-index:1;
                    width:100%;
                    height:100%;
                    background: #ffffff85;
                }
                .uploading-icon{
                    margin-top: calc(50% - 40px);
                    display:inline-block;
                }
                .percent-complete{
                    margin-top:-0.5rem;
                }
                .upload-done-img{
                    width:80px;
                    margin-top:2.5rem;
                }
                .sorry-text{
                    margin-left:1rem;
                }
                .try-again{
                    margin-top:2rem;
                }
                .status-img{
                    width:50px;
                    margin-top:3rem;
                }
                .status-text{
                    margin-top:4rem;
                }
                .status-heading{
                    margin-top:4rem;
                    font-size: 1.3rem;
                }
                .sad-img{
                    width:20px;
                }
                .confetti-img-right {
                    margin-left: 2rem;
                }
                .confetti-img-left {
                    margin-right: 2rem;
                }
                .confetti-img {
                    width: 30px;
                }
                .file-rejected{
                    margin-top:3rem;
                }
            `}</style>
        </>
    )
}
function mapStateToProps({common}){
    return {common}
}
export default connect(mapStateToProps,null)(Upload)