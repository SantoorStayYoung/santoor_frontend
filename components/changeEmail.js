import {Component} from 'react'
import LoadingIcon from './loadingIcon'
import {API_URI,TOKEN_VAR_NAME} from '../config'
class ChangeEmail extends Component{
    constructor(props){
        super(props)
        this.state = {loading:false,email:'',emailError:true,emailTouched:false,validationError:false,serverError:false,serverErrorMessage:""}
    }
    updateEmail = ()=>{
        if(!this.state.emailError){
            this.setState({loading:true,validationError:false,serverError:false,serverErrorMessage:''})
            fetch(`${API_URI}/api/auth/updatecontact`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem(TOKEN_VAR_NAME),
                },
                body: JSON.stringify({type:"email",email:this.state.email})
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result)
                if(result.status == "OK"){
                    if(this.props.onSuccess)
                        this.props.onSuccess("email",this.state.email)
                } else if(result.status == "validation_error") {
                    this.setState({validationError:true})
                } else if(result.code==400){
                    this.setState({emailError:true,emailTouched:true})
                }
                this.setState({loading:false})
            }).catch(err=>{
                console.log(err)
                this.setState({serverError:true,serverErrorMessage:"An unexpected error has occured. It could be a problem with your internet connection.",loading:false})
            })
        }
    }
    validateEmail = ()=>{
        let {email} = this.state
        if(email.length < 1){
            this.setState({emailError:true})
        } else {
            this.setState({emailError:false})
        }
    }
    onEmailChange = (email)=>{
        this.setState({email,emailError:false,emailTouched:true},this.validateEmail)
    }
    render(){
        let btnContent = this.state.loading?<LoadingIcon width="2rem" height="2rem" centered={true} show={true} weight="thin" />:"UPDATE"
        return (
            <>
            <div className="form-group padding-left">
                <input type="email" className="form-control" value={this.state.email} onChange={(e)=>this.onEmailChange(e.target.value)} placeholder="" required/>
            </div>
            {this.state.emailError && this.state.emailTouched && 
                <div className="error">Please enter a valid email.</div>
            }
            <div className="form-group text-center text-white">
                <span style={{margin:"1.5rem auto"}} onClick={()=>this.updateEmail()} className={`btn btn-primary ${this.state.emailError?"disabled":""}`}>{btnContent}</span>
            </div>
            {this.state.serverError &&
                <div className="error server-error text-center">
                    {this.state.serverErrorMessage}
                </div>
            }
            {this.state.validationError &&
                <div className="error server-error text-center">
                    This email is already taken or is invalid.
                </div>
            }
            <style jsx>{`
                .text-prefix{
                    position: absolute;
                    left: 1rem;
                    top: 0.9rem;
                }
                .form-control{
                    width:100%;
                }
            `}</style>
            </>
        )
    }
}
export default ChangeEmail