import {Component} from 'react'
import Layout from '../components/layout'
import LoadingIcon from '../components/loadingIcon'
import {API_URI} from '../config'
import {showAuth} from '../redux/actions'
import {connect} from 'react-redux'
const init_state = {
    loading:false,
    success:false,
    email:'',
    password_error:false,
    password_error_message:'',
    password_touched:false,
    confirm_password_error:false,
    confirm_password_error_message:'',
    confirm_password_touched:false,
    server_error_message:'',
    btnDisabled:true
}
class RecoverAccount extends Component {
    constructor(props){
        super(props)
        this.state = init_state
    }
    submitFormData = ()=>{
        if(!this.state.loading && !this.state.btnDisabled){
            this.setState({loading:true,server_error:false})
            fetch(`${API_URI}/api/auth/password-reset`, {
                method: 'PUT', 
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({code:this.props.code,email:this.props.email,newpassword:this.state.password,confpassword:this.state.confirm_password}) 
            })
            .then(res=>res.json())
            .then(result=>{
                if(result.code==200){
                    this.setState({success:true})
                    this.setState({loading:false})
                } else {
                    this.setState({server_error:true,server_error_message:"An unexpected error has occured. Could not reset password. Please contact support or cross check your internet connection.",loading:false})
                }
            }).catch(err=>{
                console.log(err)
                this.setState({server_error:true,server_error_message:"An unexpected error has occured. It could be a problem with your internet connection.",loading:false})
            })  
        }
    }
    validate = ()=>{
        let btnDisabled = false
        let {password_touched,confirm_password_touched} = this.state
        if(this.state.password.length < 5){
            if(password_touched)
                this.setState({password_error:true,password_error_message:"Password must be atleast 5 characters long."})
            btnDisabled = true
        } else {
            this.setState({password_error:false,password_error_message:""})
        }
        if(this.state.password != this.state.confirm_password){
            if(confirm_password_touched)
                this.setState({confirm_password_error:true,confirm_password_error_message:"Passwords don't match"})
            btnDisabled = true
        } else {
            this.setState({confirm_password_error:false,confirm_password_error_message:""})
        }
        this.setState({btnDisabled})
    }   
    onPasswordChange = (password)=>{
        this.setState({password_touched:true,password},()=>{
            this.validate();
        })
    }
    onConfirmPasswordChange = (confirm_password)=>{
        this.setState({confirm_password_touched:true,confirm_password},()=>{
            this.validate();
        })
    }
    static async getInitialProps(ctx) {
        return { code:ctx.query.code, email:ctx.query.email }
    }
    render(){
        let btnContent = this.state.loading?<LoadingIcon width="2.2rem" height="2.2rem" centered={true} show={true} weight="thin" />:"Reset"
        let btnClasses = this.state.btnDisabled?"disabled":""
        return ( 
        <Layout page="home" navColor="solid" navPosition="fixed" mainContentPadding={true}>
                <div className="content max-width-content additional-padding text-center" style={{height:`${this.props.common.windowHeight}px`}}>
                    {this.state.success?
                        <p>You password was reset successfully. You can now <span className="a" onClick={()=>this.props.showAuth(true,"login")}>login</span>.</p>
                        :
                        <div className="reset-password">
                            <h1 className="text-center">Reset password</h1>
                            <div className="recovery-form">
                            <div className="form-group">
                                <input type="password" className="form-control" value={this.state.password} onChange={(e)=>this.onPasswordChange(e.target.value)} placeholder="New password" />
                                <div className="error">{this.state.password_error_message}</div>
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" value={this.state.confirm_password} onChange={(e)=>this.onConfirmPasswordChange(e.target.value)} placeholder="New password again" />
                                <div className="error">{this.state.confirm_password_error_message}</div>
                            </div>
                            <div className="form-group text-center text-white">
                                <span style={{margin:"auto",minWidth:"15rem",maxWidth:"100%"}} onClick={()=>this.submitFormData()} className={`${btnClasses} btn btn-primary btn-larger`}>{btnContent}</span>
                            </div>
                            {this.state.server_error &&
                                <div className="error server-error text-center">
                                    {this.state.server_error_message}
                                </div>
                            }
                            </div>
                        </div>
                    }
                </div>
                <style jsx>{`
                    .form-control{
                        width:100%;
                    }
                    .content{
                        height:100%;
                        display:flex;
                        justify-content:center;
                        flex-direction:column;
                    }
                `}</style>
        </Layout>   
        )
    }
}
function mapStateToProps({common}){
    return {
        common
    }
}
export default connect(mapStateToProps,{showAuth})(RecoverAccount)

