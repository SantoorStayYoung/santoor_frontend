import {Component} from 'react'
import LoadingIcon from './loadingIcon'
import {changeTabTo} from '../redux/actions'
import {connect} from 'react-redux'
import {API_URI} from '../config'
const init_state = {
    loading:false,
    email:'',
    email_touched:false,
    account_error:false,
    account_error_message:'',
    email_error:false,
    email_error_message:'',
    server_error_message:'',
    success:false, 
    btnDisabled:true
}
class Recover extends Component {
    constructor(props){
        super(props)
        this.state = init_state 
    }
    submitFormData = ()=>{
        if(!this.state.loading && !this.state.btnDisabled){
            this.setState({loading:true,server_error:false,account_error:false})
            let {email} = this.state
            fetch(`${API_URI}/api/auth/password-recovery`, {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({email}) 
            })
            .then(res=>res.json())
            .then(result=>{
                if(result.status == "OK"){
                    this.setState({success:true})    
                } else if(result.status == "validation_error") {
                    this.setState({account_error:true,account_error_message:"No such account"})
                } else {
                    this.setState({server_error:true,server_error_message:"An unexpected error has occured. It could be a problem with your internet connection."})
                }
                this.setState({loading:false})
            }).catch(err=>{
                console.log(err)
                this.setState({server_error:true,server_error_message:"An unexpected error has occured. It could be a problem with your internet connection.",loading:false})
            })  
        }
    }
    validate = ()=>{
        let btnDisabled = false
        let {email_touched} = this.state
        if(this.state.email==""){
            if(email_touched)
                this.setState({email_error:true,email_error_message:"Email is required"})
            btnDisabled = true
        } else {
            this.setState({email_error:false,email_error_message:""})
        }
        this.setState({btnDisabled})
    }   
    onEmailChange = (email)=>{
        this.setState({email_touched:true,email},()=>{
            this.validate('email');
        })
    }
    render(){
        let btnContent = this.state.loading?<LoadingIcon width="2.2rem" height="2.2rem" centered={true} show={true} weight="thin" />:"Recover"
        let btnClasses = this.state.btnDisabled?"disabled":""
        return (
            <>
            <div className="wrapper">
                <h1 className="purple text-center">Recover Account</h1>
                <div className="login-form">
                        <div className="form-wrapper">
                            {this.state.success?
                                <div className="success-message">
                                    Please follow instructions sent to your email address to recover your account. If you didn't recieve an email, <span className="a" onClick={()=>this.setState({success:false})}>try again</span>
                                </div>
                            :
                                <div>
                                    <div className="form-group">
                                        <input type="email" className="form-control" value={this.state.email} onChange={(e)=>this.onEmailChange(e.target.value)} placeholder="Enter e-mail address" />
                                        <div className="error">{this.state.email_error_message}</div>
                                    </div>
                                    <div className="form-group text-center text-white">
                                        <span style={{margin:"auto",minWidth:"15rem",maxWidth:"100%"}} onClick={()=>this.submitFormData()} className={`${btnClasses} btn-primary btn margin-auto btn-larger`}>{btnContent}</span>
                                    </div>
                                    {this.state.server_error &&
                                        <div className="error server-error text-center">
                                            {this.state.server_error_message}
                                        </div>
                                    }
                                    {this.state.account_error &&
                                        <div className="error server-error text-center">
                                            {this.state.account_error_message}
                                        </div>
                                    }
                                </div>
                            }
                            <div className="form-group text-center">
                                <span className="a" onClick={()=>this.props.changeTabTo("register")}>Register</span> &nbsp;.&nbsp; <span className="a" onClick={()=>this.props.changeTabTo("login")}>Login</span>
                            </div>
                        </div>
                </div>
            </div>  
            <style jsx>{`
                .wrapper{
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    height:100%;
                }
                .login-form{
                    padding:0 5%;
                    margin-top:2rem;
                }
                .error{
                    margin:0.5rem;
                }
            `}</style>
            </>
        )
    }
}
export default connect(null,{changeTabTo})(Recover)