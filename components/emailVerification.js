import {Component} from 'react'
import LoadingIcon from './loadingIcon'
import {changeTabTo,showAuth,authUpdate} from '../redux/actions'
import { connect } from 'react-redux'
import OTPInput from './OTPInput'
import {API_URI,TOKEN_VAR_NAME} from '../config'
import Router from 'next/router'
import ChangeEmail from './changeEmail'
class Verification extends Component {
    constructor(props){
        super(props)
        this.state = {success:true,loading:false,showChangeEmail:false,otpError:false,serverError:false,serverErrorMessage:'',pendingResends:null,waitingTime:null,otpExpiry:null,otpExpired:false,resendLimitReached:false,resendShow:false}
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
    sendOTP = ()=>{
        this.setState({loading:true,success:false,otpError:false,serverError:false,serverErrorMessage:''})
        fetch(`${API_URI}/api/auth/send-otp`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem(TOKEN_VAR_NAME),
            },
            body: JSON.stringify({type:"email"})
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            if(result.status == "OK"){
                console.log('success')
                this.setState({success:true,otpExpired:false,pendingResends:result.pendingResends,waitingTime:result.waitingTime,otpExpiry:result.otpExpiry,resendShow:false},()=>{
                    this.startOtpExpiryCountDown()
                    this.resendShowCountdown()
                })
            } else if(result.status=="resend_limit_reached"){
                this.setState({resendLimitReached:true})
            }
            this.setState({loading:false})
        }).catch(err=>{
            console.log(err)
            this.setState({serverError:true,serverErrorMessage:"An unexpected error has occured. It could be a problem with your internet connection.",loading:false})
        })
    }
    submitOTP = (code)=>{
        if(!this.state.otpExpired ){
            this.setState({loading:true,invalidOTP:false,serverError:false,serverErrorMessage:''})
            fetch(`${API_URI}/api/auth/smsverify`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem(TOKEN_VAR_NAME),
                },
                body: JSON.stringify({code})
            })
            .then(res=>res.json())
            .then(result=>{
                if(result.status == "OK"){
                    this.props.authUpdate({isValidEmail:1})
                    this.props.showAuth(false)
                    Router.push('/participant-dashboard').then(() => window.scrollTo(0, 0));
                } else{
                    this.setState({invalidOTP:true})
                }
                this.setState({loading:false})
            }).catch(err=>{
                console.log(err)
                this.setState({serverError:true,serverErrorMessage:"An unexpected error has occured. It could be a problem with your internet connection.",loading:false})
            })
        }
    }
    componentDidMount(){
        this.sendOTP()
    }
    emailChanged = (email)=>{
        this.props.authUpdate({email})
        this.setState({showChangeEmail:false})
        this.sendOTP()
    }
    render(){
        return(
                <>
                    <div className="wrapper">
                        <h1 className="text-center">Email Verification</h1>
                        <div className="sub-heading text-center">Step 2 of 2</div>
                        {this.state.loading && 
                            <div style={{marginTop:"2rem"}}>
                                <LoadingIcon width="5rem" height="5rem" centered={true} show={true} weight="thin" />
                            </div>
                        }
                        {this.state.success && !this.state.loading &&
                            <div>
                                <div className="otp-sent text-center">OTP sent to <span className="bold">{this.props.auth.email}</span> <span className="change-email" onClick={()=>this.setState({showChangeEmail:!this.state.showChangeEmail})}>Change email {this.state.showChangeEmail?"-":""}</span></div>
                                <div className={`change-email-form text-center ${this.state.showChangeEmail?"show":""}`}>
                                    <ChangeEmail onSuccess={(email)=>this.emailChanged(email)} />
                                </div>
                                <div className="otp-entry">
                                    <OTPInput fields={4} submit={(code)=>this.submitOTP(code)} />
                                </div>
                                <div className="error">Invalid OTP entered.</div>
                                <div className="otp-expiry text-center">
                                    {this.state.otpExpired?
                                        <span className="error">OTP Expired.</span>
                                        :
                                        <span>OTP Expiries in {this.getTimeDisplayString(this.state.otpExpiry)}</span>
                                    }
                                </div>
                                <div className="text-center resend">
                                    {this.state.pendingResends==0?
                                        <span className="error">Resend limit reached. Try <span className="underline" onClick={()=>this.props.changeTabTo("emailVerification")}>Email Verification</span>.</span>
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
                            </div>
                        }
                        {this.state.resendLimitReached &&
                            <div className="resend-limit-reached text-center">
                                    <p>You have exceeded maximum number of tries for Email Verification.</p> 
                                    <p>Please contact support.</p>
                            </div>
                        }
                    </div>  
                    <style jsx>{`
                        .otp-entry{
                            display:flex;
                            justify-content:center;
                            margin-top:5.1rem;
                        }
                        .otp-sent{
                            margin-top:7.7rem;
                        }
                        .change-email{
                            text-decoration:underline;
                            cursor:pointer;
                        }
                        .change-email-form{
                            margin:3rem auto;
                            width:50%;
                            max-height:0;
                            overflow:hidden;
                            transition: all 0.2s cubic-bezier(.785,.135,.15,.86);
                        }
                        .change-email-form.show{
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
                    `}</style>
            </>
        )
    }
}
function mapStateToProps({common,auth}){
    return {common,auth}
}
export default connect(mapStateToProps,{changeTabTo,showAuth,authUpdate})(Verification)