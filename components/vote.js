import {Component} from 'react'
import LoadingIcon from './loadingIcon'
import {changeTabTo,showAuth,authUpdate} from '../redux/actions'
import { connect } from 'react-redux'
import OTPInput from './OTPInput'
import {API_URI} from '../config'
class Vote extends Component {
    constructor(props){
        super(props)
        this.state = {confirmingVote:false,invalidConfirmationCode:false,voteConfirmed:false,confirmVoteError:false,phone:'',phoneError:true,phoneTouched:false,success:false,loading:false,serverError:false,serverErrorMessage:'',pendingResends:null,waitingTime:null,otpExpiry:null,otpExpired:false,resendLimitReached:false,resendShow:false,code:''}
        this.otpInterval = null
        this.resendShowTimer = null
    }
    getTimeDisplayString=(timeInSeconds)=>{
        var minutes = Math.floor(timeInSeconds / 60);
        var seconds = timeInSeconds - minutes * 60;
        if(seconds<10)
            seconds = `0${seconds}`
        return `${minutes}:${seconds}`
    }
    startOtpExpiryCountDown = ()=>{
        clearInterval(this.otpInterval)
        this.otpInterval = setInterval(()=>{
            let otpExpiry = this.state.otpExpiry-1
            if(otpExpiry > 0)
                this.setState({otpExpiry})
            else{
                clearInterval(this.otpInterval)
                this.setState({otpExpired:true})
            }
        },1000)
    }
    resendShowCountdown = ()=>{
        clearTimeout(this.resendShowTimer)
        this.resendShowTimer = setInterval(()=>{
            let waitingTime = this.state.waitingTime-1
            if(waitingTime > 0)
                this.setState({waitingTime})
            else{
                clearInterval(this.resendShowTimer)
                this.setState({resendShow:true})
            }
        },1000)
    }
    confirmVote = ()=>{
        if(this.state.code.length == 4){
            this.setState({confirmingVote:true,invalidConfirmationCode:false,confirmVoteError:false})
            fetch(`${API_URI}/api/dashboard/confirmvote`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code:this.state.code,
                    phone:this.state.phone,
                    videoid:this.props.videoid 
                })
            })
            .then(res=>res.json())
            .then(result=>{
                if(result.status == "OK"){
                    this.setState({voteConfirmed:true})
                } else if(result.status=="validation_error"){
                    this.setState({invalidConfirmationCode:true})
                }
                this.setState({confirmingVote:false})
            }).catch(err=>{
                console.log(err)
                this.setState({confirmVoteError:true,confirmingVote:false})
            })
        }
    }
    sendOTP = ()=>{
        this.setState({loading:true,success:false,serverError:false,serverErrorMessage:'',alreadyVoted:false,invalidConfirmationCode:false})
        fetch(`${API_URI}/api/dashboard/vote`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone:this.state.phone,
              videoid:this.props.videoid  
            })
        })
        .then(res=>res.json())
        .then(result=>{
            if(result.status == "OK"){
                this.setState({success:true,otpExpired:false,alreadyVoted:false,pendingResends:result.pendingResends,waitingTime:result.waitingTime,otpExpiry:result.otpExpiry,resendShow:false},()=>{
                    this.startOtpExpiryCountDown()
                    this.resendShowCountdown()
                })
            } else if(result.status=="resend_limit_reached"){
                this.setState({resendLimitReached:true})
            } else if(result.status=="vote_error"){
                this.setState({alreadVoted:true})
            }
            this.setState({loading:false})
        }).catch(err=>{
            console.log(err)
            this.setState({serverError:true,serverErrorMessage:"An unexpected error has occured. It could be a problem with your internet connection.",loading:false})
        })
    }
    validatePhone = ()=>{
        let {phone} = this.state
        if(isNaN(phone) || phone.length != 10){
            this.setState({phoneError:true})
        } else {
            this.setState({phoneError:false})
        }
    }
    onPhoneChange = (phone)=>{
        this.setState({phone,phoneTouched:true},this.validatePhone)
    }
    render(){
        let btnContent = this.state.confirmingVote?<LoadingIcon width="2.2rem" height="2.2rem" centered={true} show={true} weight="thin" />:"CONFIRM VOTE"
        return(
                <>
                    {this.state.voteConfirmed &&
                        <div className="vote-confirmed text-center">Thank you for voting for this participant. Your vote has been recorded.</div>
                    }
                    {!this.state.voteConfirmed && 
                        <div className="wrapper">
                                <h1 className="text-center">Vote</h1>
                                <div className="send-otp">
                                    <div className="send-top-label">ENTER MOBILE NUMBER</div>
                                        <input type="text" className="form-control" className="send-otp-input form-control" value={this.state.phone} onChange={(e)=>this.onPhoneChange(e.target.value)} disabled={this.state.success} /> 
                                        {!this.state.phoneError && !this.state.loading && !this.state.success && <span className="send-otp-text cursor-pointer bold inline-element" onClick={()=>this.sendOTP()}>SEND OTP</span>}
                                        {this.state.success && <span className="send-otp-text cursor-pointer bold inline-element" onClick={()=>this.setState({success:false,code:''})}>Change number</span>}
                                </div>
                                {this.state.alreadVoted && 
                                    <div className="error">You have already voted for this video.</div>
                                }
                                {this.state.serverError && 
                                    <div className="error">{this.state.serverErrorMessage}</div>
                                }
                                {this.state.loading && 
                                    <div className="text-center loading-icon">
                                        <LoadingIcon width="3rem" height="3rem" centered={true} show={true} weight="thin" />
                                    </div>
                                }
                                {this.state.success && 
                                    <div>
                                        <div className={`otp-entry`}>
                                            <OTPInput fields={4} onChange={(code)=>this.setState({code})} />
                                        </div>
                                        <div className="otp-expiry text-center">
                                            {this.state.otpExpired?
                                                <span className="error">OTP Expired.</span>
                                                :
                                                <span>OTP Expiries in {this.getTimeDisplayString(this.state.otpExpiry)}</span>
                                            }
                                        </div>
                                        <div className="text-center resend">
                                            {this.state.pendingResends==0?
                                                <span className="error">Resend limit reached.</span>
                                            :
                                                <div>
                                                    {this.state.resendShow?
                                                        <span className="underline cursor-pointer" onClick={()=>this.sendOTP()}>Resend OTP({this.state.pendingResends})</span>
                                                        :
                                                        <span className="resend-time">You can resend OTP in {this.getTimeDisplayString(this.state.waitingTime)}</span>
                                                    }
                                                </div>
                                            }
                                        </div> 
                                        <div className="text-center vote-btn-wrapper">
                                            <button className={`btn btn-primary margin-auto btn-larger ${this.state.code.length == 4 && !this.state.otpExpired?"":"disabled"}`} onClick={()=>this.confirmVote()}>{btnContent}</button>
                                            {this.state.invalidConfirmationCode && 
                                                <div className="error">Invalid OTP. Please try again.</div>
                                            }
                                            {this.state.confirmVoteError && 
                                                <div className="error">Could not confirm the vote. An unexpected error has occured.</div>
                                            }
                                        </div>
                                    </div>
                                }
                                {this.state.resendLimitReached &&
                                    <div className="resend-limit-reached text-center">
                                        <div>
                                            <p>You have exceeded maximum number of tries to vote. Try again later.</p> 
                                        </div>
                                    </div>
                                }
                        </div>  
                    }
                    <style jsx>{`
                        .error{
                            margin-top:0.5rem;
                        }
                        .send-otp{
                            margin-top:2rem;   
                        }
                        .send-otp-input{
                            width: ${this.state.success?"calc(100% - 15rem)":"calc(100% - 12rem)"};
                        }
                        .loading-icon{
                            margin-top:1rem;
                        }
                        .otp-entry{
                            display:flex;
                            justify-content:center;
                            margin-top:5.1rem;
                        }
                        .otp-sent{
                            margin-top:7.7rem;
                        }
                        .change-contact{
                            text-decoration:underline;
                            cursor:pointer;
                        }
                        .change-contact-form{
                            margin:3rem auto;
                            width:50%;
                            max-height:0;
                            overflow:hidden;
                            transition: all 0.2s cubic-bezier(.785,.135,.15,.86);
                        }
                        .change-contact-form.show{
                            max-height:20rem;
                        }
                        .otp-expiry{
                            margin-top:6.5rem;
                        }
                        .resend{
                            margin-top:1rem;
                        }
                        .resend-time{
                            font-size:1rem;
                        }
                        .resend-limit-reached{
                            margin-top:5.1rem;
                        }
                        .send-otp-text{
                            margin-left:2rem;
                        }
                        .vote-btn-wrapper{
                            margin-top:2rem
                        }
                        .vote-confirmed{
                            display:flex;
                            flex-direction:column;
                            justify-content:center;
                            height:100%;
                        }
                    `}</style>
            </>
        )
    }
}
function mapStateToProps({common,auth}){
    return {common,auth}
}
export default connect(mapStateToProps,{changeTabTo,showAuth,authUpdate})(Vote)