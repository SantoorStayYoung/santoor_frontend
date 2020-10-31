import {Component} from 'react'
import LoadingIcon from './loadingIcon'
import {login,showAuth,changeTabTo} from '../redux/actions'
import {connect} from 'react-redux'
import Router from 'next/router'
import {API_URI,DONT_LOGIN_REDIRECT} from '../config'
import {faEye,faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
const init_state = {
    loading:false,
    email:'',
    emailError:true,
    emailTouched:false,
    password:'',
    passwordError:true,
    passwordTouched:false,
    showPassword:false,
    serverError:false,
    serverErrorMessage:'',
    invalid:false
}
class Login extends Component {
    constructor(props){
        super(props)
        this.state = init_state 
    }
    login = (result)=>{
        this.props.login(result.isValidMobile,result.isValidEmail,result.token,result.email,result.phone,result.name)
        this.setState({init_state})
        if(result.isValidMobile || result.isValidEmail){
            this.props.showAuth(false)
            if(!DONT_LOGIN_REDIRECT.includes(this.props.page))
                Router.push('/participant-dashboard').then(() => window.scrollTo(0, 0));
        } else {
            this.props.changeTabTo("verification")
        }
    }
    submitFormData = ()=>{
        if(!this.state.loading && !this.validationError()){
            this.setState({loading:true,serverError:false,invalid:false})
            let {email,password} = this.state
            fetch(`${API_URI}/api/auth/login`, {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({email,password}) 
            })
            .then(res=>res.json())
            .then(result=>{
                if(result.status == "OK"){
                    this.login(result)
                } else if(result.status=="validation_error") {
                    this.setState({invalid:true})
                } else {
                    this.setState({serverError:true,serverErrorMessage:result.message,loading:false})
                }
                this.setState({loading:false})
            }).catch(err=>{
                console.log(err)
                this.setState({serverError:true,serverErrorMessage:"An unexpected error has occured. It could be a problem with your internet connection.",loading:false})
            })  
        }
    }
    validationError = ()=>{
        let {emailError,passwordError} = this.state
        return emailError || passwordError
    }
    validateEmail = ()=>{
        let {email} = this.state
        if(email.length < 1){
            this.setState({emailError:true})
        } else {
            this.setState({emailError:false})
        }
    }
    validatePassword = ()=>{
        let {password} = this.state
        if(password.length < 1){
            this.setState({passwordError:true})
        } else {
            this.setState({passwordError:false})
        }
    }
    onPasswordChange = (password)=>{
        this.setState({password,passwordTouched:true},this.validatePassword)
    }
    onEmailChange = (email)=>{
        this.setState({email,emailTouched:true},this.validateEmail)
    }
    componentDidMount(){
        let email = localStorage.getItem('rememberedEmail')
        if(email)
        this.setState({email,emailTouched:true},()=>{
            this.validateEmail()
        })
    }
    render(){
        let btnContent = this.state.loading?<LoadingIcon width="2.2rem" height="2.2rem" centered={true} show={true} weight="thin" />:"LOGIN"
        return (
            <>
            <div className="wrapper">
                <h1 className="text-center">LOGIN</h1>
                <div className="login-form">
                    <div className="form-group">
                        <input type="email" className="form-control" value={this.state.email} onChange={(e)=>this.onEmailChange(e.target.value)} placeholder="Enter e-mail address" />
                    </div>
                    <div className="form-group">
                        <input type={`${this.state.showPassword?"text":"password"}`} className="form-control" value={this.state.password} onChange={(e)=>this.onPasswordChange(e.target.value)} placeholder="Enter password" />
                        {this.state.showPassword?
                            <span className="eye">
                                <FontAwesomeIcon icon={faEye} className="fa" onClick={()=>this.setState({showPassword:false})}/>
                            </span>
                        :
                            <span className="eye">
                                <FontAwesomeIcon icon={faEyeSlash} className="fa eye" onClick={()=>this.setState({showPassword:true})}/>
                            </span>
                        }
                    </div>
                    <div className="form-group text-center text-white text-center">
                        <button  onClick={()=>this.submitFormData()} className={`btn btn-primary btn-larger margin-auto ${this.validationError()?"disabled":""}`}>{btnContent}</button>
                    </div>
                    {this.state.invalid &&
                        <div className="error server-error text-center">
                            Invalid email id and password combination
                        </div>
                    }
                    {this.state.serverError &&
                        <div className="error server-error text-center">
                            {this.state.serverErrorMessage}
                        </div>
                    }
                    <div className="form-group text-center">
                        <span className="a" onClick={()=>this.props.changeTabTo("register")}>Register</span> &nbsp;.&nbsp; <span className="a" onClick={()=>this.props.changeTabTo("recover")}>Recover Account</span>
                    </div>
                </div>
            </div>  
            <style jsx>{`
                .google-loading-wrapper{
                    display:flex;
                    height:100%;
                    justify-content:center;
                    flex-direction:column;
                }
                .login-form{
                    padding:3rem 5% 0 5%;
                }
                .error{
                    margin:0.5rem;
                }
                .form-group{
                    position:relative;
                }
                .eye{
                    position:absolute;
                    right:1rem;
                    top:1rem;
                    color:#918F8F;
                    width:1.55rem;
                }
                .wrapper{
                    height:100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
            `}</style>
            </>
        )
    }
}
export default connect(null,{login,showAuth,changeTabTo})(Login)