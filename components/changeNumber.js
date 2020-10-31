import {Component} from 'react'
import LoadingIcon from './loadingIcon'
import {API_URI,TOKEN_VAR_NAME} from '../config'
class ChangeNumber extends Component{
    constructor(props){
        super(props)
        this.state = {loading:false,phone:'',phoneError:true,phoneTouched:false,validationError:false,serverError:false,serverErrorMessage:""}
    }
    changeNumber = ()=>{
        if(!this.state.phoneError){
            this.setState({loading:true,validationError:false,serverError:false,serverErrorMessage:''})
            fetch(`${API_URI}/api/auth/updatecontact`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem(TOKEN_VAR_NAME),
                },
                body: JSON.stringify({type:"phone",phone:this.state.phone})
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result)
                if(result.status == "OK"){
                    if(this.props.onSuccess)
                        this.props.onSuccess("phone",this.state.phone)
                } else if(result.status == "validation_error") {
                    this.setState({validationError:true,loading:false})
                } 
                this.setState({loading:false})
            }).catch(err=>{
                console.log(err)
                this.setState({serverError:true,serverErrorMessage:"An unexpected error has occured. It could be a problem with your internet connection.",loading:false})
            })
        }
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
        let btnContent = this.state.loading?<LoadingIcon width="2rem" height="2rem" centered={true} show={true} weight="thin" />:"UPDATE"
        return (
            <>
            <div className="form-group">
                <div className="position-relative">
                    <span className="text-prefix">+91</span>
                    <input type="text" style={{paddingLeft:"4rem"}} className="form-control" value={this.state.phone} onChange={(e)=>this.onPhoneChange(e.target.value)} placeholder="" required/>
                </div>
                {this.state.phoneError && this.state.phoneTouched && 
                    <div className="error">Please enter a valid 10 digit mobile number</div>
                }
                <div className="form-group text-center text-white">
                    <span style={{margin:"1.5rem auto"}} onClick={()=>this.changeNumber()} className={`btn btn-primary ${this.state.phoneError?"disabled":""}`}>{btnContent}</span>
                </div>
                {this.state.serverError &&
                    <div className="error server-error text-center">
                        {this.state.serverErrorMessage}
                    </div>
                }
                {this.state.validationError &&
                    <div className="error server-error text-center">
                        This number is already taken.
                    </div>
                }
            </div>
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
export default ChangeNumber