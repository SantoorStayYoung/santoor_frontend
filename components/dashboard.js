import { connect } from 'react-redux';
import {NAV_HEIGHT,SITE_URL,API_URI,TOKEN_VAR_NAME} from '../config'
import { useEffect, useState } from 'react';
import Player from '@vimeo/player';
import LoadingIcon from '../components/loadingIcon'
import Share from '../components/share'
function Dashboard(props){
    const [formVisible,showForm] = useState(false)
    const [delRequestError,showDelRequestError] = useState(false)
    const [undoRequestError,showUndoRequestError] = useState(false)
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        var options = {
            id: props.info.videoid,
            controls:true,
            title:false,
            byline:false,
            responsive:true,
            portrait:false,
        };
        var player = new Player('participant-video', options);
    },[])
    function requestDelete(){
        showDelRequestError(false)
        setLoading(true)
        fetch(`${API_URI}/api/dashboard/del_request`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem(TOKEN_VAR_NAME),
                }
        })
        .then(res=>res.json())
        .then(result=>{
            if(result.status=="OK"){
                props.setDelRequest(1)
            } else {
                showDelRequestError(true)
            }
            setLoading(false)
        }).catch(err=>{
            console.log(err)
            showDelRequestError(true)
            setLoading(false)
        })
    }
    function undoDelete(){
        showUndoRequestError(false)
        setLoading(true)
        fetch(`${API_URI}/api/dashboard/del_request`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem(TOKEN_VAR_NAME),
                },
                body:JSON.stringify({undo:1})
        })
        .then(res=>res.json())
        .then(result=>{
            if(result.status=="OK"){
                props.setDelRequest(0)

            } else {
                showUndoRequestError(true)
            }
            setLoading(true)
        }).catch(err=>{
            console.log(err)
            showUndoRequestError(true)
            setLoading(true)
        })
    }
    let btnContentDel = loading?<LoadingIcon width="2rem" height="2rem" centered={true} show={true} weight="thin" />:"SUBMIT"
    let btnContentUndo = loading?<LoadingIcon width="2rem" height="2rem" centered={true} show={true} weight="thin" />:"UNDO"
    return(
        <>
            <div className="max-width-content content" style={{minHeight:`calc(${props.common.windowHeight}px - ${NAV_HEIGHT}`}}>       
                <div className="participant-name">
                    <h1>{props.auth.name}</h1>        
                </div>        
                <div id="participant-video"></div>
                <div className="share-entry-title text-center">Share your entry</div>
                <div className="text-center">
                    <Share url={`${SITE_URL}/video/${props.info.videoid}`}/>
                </div>
                <div className="share-text">
                    Share the link with your friends and family. Get entry into the Top Voted Videos.
                </div>
                {props.info.delrequest==0 &&
                    <div className="request-removal">
                        <button className="btn btn-grey" onClick={()=>showForm(!formVisible)}>REQUEST REMOVAL</button>
                        <div className={`request-removal-form ${formVisible?"show":""}`}>
                            <textarea rows="5" className="form-control" placeholder="Reason"></textarea>
                            <div className="text-center">
                                <button className="btn btn-primary margin-auto" onClick={()=>requestDelete()}>{btnContentDel}</button>
                            </div>
                            {delRequestError && 
                                <div className="error">Could not send request.</div>
                            }
                        </div>
                    </div>
                }
                {props.info.delrequest==1 &&
                    <div className="undo-removal">
                        <p>You have requested for removal of this video.</p>
                        <button className="btn btn-grey" onClick={()=>undoDelete()}>{btnContentUndo}</button>
                        {undoRequestError && 
                                <div className="error">Could not send request.</div>
                        }
                    </div>
                }
            </div>
            <style jsx>{`
                .content{
                    height:100%;
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
                .share-entry-title{
                    margin:2.5rem 0;
                }
                .share-text{
                    color:#918F8F;
                    margin:2.5rem 0;
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
            `}</style>
        </>
    )
}
function mapStateToProps({common,auth}){
    return {common,auth}
}
export default connect(mapStateToProps,null)(Dashboard)