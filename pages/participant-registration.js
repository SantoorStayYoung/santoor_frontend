import {Component} from 'react'
import Layout from '../components/layout'
import LoadingIcon from '../components/loadingIcon'
class ParticipantRegistration extends Component{
    constructor(props){
        super(props)
        this.state = {
            loading:false,
            btnDisabled:true,
            fullName:'',
            fullNameTouched:false,
            fullNameError:false,
            age:'',
            ageTouched:false,
            ageError:false,
            phone:'',
            phoneTouched:false,
            phoneError:false,
            email:'',
            emailTouched:false,
            emailError:false,
            password:'',
            passwordTouched:false,
            passwordError:false,
            confPassword:'',
            confPasswordTouhced:false,
            confPasswordError:false
        }
    }
    validate = ()=>{
        let btnDisabled = false
        let {fullName,age,phone,email,password,confPassword,fullNameTouched,ageTouched,phoneTouched,emailTouched,passwordTouched,confPasswordTouched} = this.state
        if(fullName==""){
            if(fullNameTouched)
                this.setState({fullNameError:true})
            btnDisabled = true
        } else {
            this.setState({fullNameError:false})
        }
        if(age==""){
            if(ageTouched)
                this.setState({ageError:true})
            btnDisabled = true
        } else {
            this.setState({ageError:false})
        }
        if(phone==""){
            if(phoneTouched)
                this.setState({phoneError:true})
            btnDisabled = true
        } else {
            this.setState({phoneError:false})
        }
        if(email==""){
            if(emailTouched)
                this.setState({emailError:true})
            btnDisabled = true
        } else {
            this.setState({emailError:false})
        }
        if(password==""){
            if(passwordTouched)
                this.setState({passwordError:true})
            btnDisabled = true
        } else {
            this.setState({passwordError:false})
        }
        if(confPassword=="" || password!=confPassword){
            if(confPasswordTouched)
                this.setState({confPasswordError:true})
            btnDisabled = true
        } else {
            this.setState({confPasswordError:false})
        }
        this.setState({btnDisabled})
    } 
    onChangeHandler = (field,value)=>{
        this.setState({[field]:value,[`${field}Touched`]:true},()=>this.validate())
    }
    render(){
        let btnContent = this.state.loading?<LoadingIcon width="2.2rem" height="2.2rem" centered={true} show={true} weight="thin" />:"Submit"
        let btnClasses = this.state.btnDisabled?"btn-disabled":""
        return (
            <Layout navPosition="fixed">
                <div className="participant-registration-form padded-content">
                    <h1>Participant Registration Form</h1>
                    <div className="row no-gutters">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Full name</label>
                                <input type="text" value={this.state.fullName} onChange={(e)=>this.onChangeHandler('fullName',e.target.value)} />
                                {this.state.fullNameError &&
                                    <div className="error">Full name is required</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Age</label>
                                <input type="text" value={this.state.age} onChange={(e)=>this.onChangeHandler('age',e.target.value)} />
                                {this.state.ageError &&
                                    <div className="error">Invalid age</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row no-gutters">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Phone number(+91)</label>
                                <input type="text" value={this.state.phone} onChange={(e)=>this.onChangeHandler('phone',e.target.value)}/>
                                {this.state.phoneError &&
                                    <div className="error">Invalid phone number</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={this.state.email} onChange={(e)=>this.onChangeHandler('email',e.target.value)} />
                                {this.state.emailError &&
                                    <div className="error">Invalid email</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row no-gutters">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Set a password</label>
                                <input type="password" value={this.state.password} onChange={(e)=>this.onChangeHandler('password',e.target.value)} />
                                {this.state.passwordError && 
                                    <div className="error">Password is required</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Confirm password</label>
                                <input type="password" value={this.state.confPassword} onChange={(e)=>this.onChangeHandler('confPassword',e.target.value)} />
                                {this.state.confPasswordError &&
                                    <div className="error">Does not match password</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="button" className={`btn ${btnClasses}`}>{btnContent}</button>
                    </div>
                </div>
                <style jsx>{`
                    .participant-registration-form{
                        padding-top:3rem;
                        padding-bottom:3rem;
                    }
                    .error{
                        font-size:1.2rem;
                        margin-top:0.5rem;
                    }
                `}</style>
            </Layout>
        )
    }
}
export default ParticipantRegistration