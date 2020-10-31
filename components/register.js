import {Component} from 'react'
import LoadingIcon from './loadingIcon'
import {changeTabTo,login,showAuth} from '../redux/actions'
import { connect } from 'react-redux'
import {API_URI,DONT_LOGIN_REDIRECT} from '../config'
import Router from 'next/router'
import {citiesAndStates} from '../data'
import SearchAndSelect from '../components/searchAndSelect'
const init_state = {
    loading:false,
    name:'',
    nameError: true,
    nameTouched:false,
    email:'',
    emailError:true,
    emailTouched:false,
    state:'',
    stateError:true,
    stateTouched:false,
    city:'',
    cityError:true,
    cityTouched:false,
    password:'',
    passwordError:true,
    passwordTouched:false,
    age:'',
    ageError:true,
    ageTouched:false,
    phone:'',
    phoneError:true,
    phoneTouched:false,
    facebook:'',
    instagram:'',
    serverError:false,
    serverErrorMessage:'',
    validationError:false,
    userExistsError:false
}
const states = []
citiesAndStates.forEach(item=>{
    if(!states.includes(item.state))
    states.push(item.state)
})
class Signup extends Component {
    constructor(props){
        super(props)
        this.state = init_state
    }
    submitFormData = ()=>{
        if(!this.state.loading && !this.validationError()){
            this.setState({loading:true,serverError:false,validationError:false,userExistsError:false})
            let {name,email,state,city,age,phone,facebook,instagram,password} = this.state
            fetch(`${API_URI}/api/auth/signup`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({name,email,state,city,age,phone,facebook,instagram,password})
            })
            .then(res=>res.json())
            .then(result=>{
                if(result.status == "OK"){
                    this.props.login(result.isValidMobile,result.isValidEmail,result.token,result.email,result.phone,result.name)
                    this.setState({init_state})
                    this.props.changeTabTo("verification")
                } else if(result.status=="validation_error") {
                    result.errors.forEach(err=>{
                        this.setState({[`${err.field}Error`]:true,[`${err.field}Touched`]:true})
                    })
                    this.setState({validationError:true})
                } else if(result.status=="reg_error") {
                    this.setState({userExistsError:true})
                } 
                this.setState({loading:false})
            }).catch(err=>{
                console.log(err)
                this.setState({serverError:true,serverErrorMessage:"An unexpected error has occured. It could be a problem with your internet connection.",loading:false})
            })
        }
    }
    validationError = ()=>{
        let {nameError,emailError,stateError,cityError,ageError,phoneError,passwordError} = this.state
        return nameError || emailError || stateError || cityError || ageError || phoneError || passwordError
    }
    validateName = ()=>{
        let {name} = this.state
        if(name.length < 2 || name.length > 70){
            this.setState({nameError:true})
        } else {
            this.setState({nameError:false})
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
    validatePassword = ()=>{
        let {password} = this.state
        if(password.length < 5 || password.length > 30){
            this.setState({passwordError:true})
        } else {
            this.setState({passwordError:false})
        }
    }
    validateState = ()=>{
        let {state} = this.state
        if(!states.includes(state)){
            this.setState({stateError:true})
        } else {
            this.setState({stateError:false})
        }
    }
    validateCity = ()=>{
        let {city,state} = this.state
            let cities = []
            citiesAndStates.forEach(item=>{
                if(item.state==state)
                cities.push(item.name)
            })
            if(!cities.includes(city)){
                this.setState({cityError:true})
            } else {
                this.setState({cityError:false})
            }
    }
    validateAge = ()=>{
        let {age} = this.state
        if(isNaN(age) || (!isNaN(age) && (age < 18 || age > 120))){
            this.setState({ageError:true})
        } else {
            this.setState({ageError:false})
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
    onNameChange = (name)=>{
        this.setState({name,nameTouched:true},this.validateName)
    }
    onEmailChange = (email)=>{
        this.setState({email,emailTouched:true},this.validateEmail)
    }
    onPasswordChange = (password)=>{
        this.setState({password,passwordTouched:true},this.validatePassword)
    }
    onStateChange = (state)=>{
        this.setState({state,city:'',stateTouched:true},this.validateState)
    }
    onCityChange = (city)=>{
        this.setState({city,cityTouched:true},this.validateCity)
    }
    onAgeChange = (age)=>{
        this.setState({age,ageTouched:true},this.validateAge)
    }
    onPhoneChange = (phone)=>{
        this.setState({phone,phoneTouched:true},this.validatePhone)
    }
    render(){
        let btnContent = this.state.loading?<LoadingIcon width="2rem" height="2rem" centered={true} show={true} weight="thin" />:"REGISTER"
        let cities = []
        citiesAndStates.forEach(item=>{
            if(this.state.state != "" && item.state==this.state.state)
            cities.push(item.name)
        })
        return(
                <>
                    <div className="wrapper">
                        <h1 className="text-center">REGISTER NOW</h1>
                        <div className="sub-heading text-center">Step 1 of 2</div>
                        <div className="login-form">
                            <div className="form-group">
                                <label>NAME<span className="star">*</span></label>
                                <input type="text" className="form-control" value={this.state.name} onChange={(e)=>this.onNameChange(e.target.value)} placeholder="Enter full name" required/>    
                                {this.state.nameError && this.state.nameTouched &&
                                    <div className="error">Name to be between 2 - 70 characters</div>
                                }
                            </div>
                            <div className="form-group">
                                <label>EMAIL<span className="star">*</span></label>
                                <input type="email" className="form-control" value={this.state.email} onChange={(e)=>this.onEmailChange(e.target.value)} placeholder="Enter e-mail address" required/>
                                {this.state.emailError && this.state.emailTouched &&
                                    <div className="error">Please enter a valid email address</div>
                                }
                            </div>
                            <div className="form-group">
                                <label>PASSWORD<span className="star">*</span></label>
                                <input type="password" className="form-control" value={this.state.password} onChange={(e)=>this.onPasswordChange(e.target.value)} placeholder="" required/>    
                                {this.state.passwordError && this.state.passwordTouched &&
                                    <div className="error">Password has to between 5 - 30 characters. Allowed characters are aphabets, numbers and special characters</div>
                                }
                            </div>
                            <div className="row no-gutters">
                                    <div className="col-md-6">
                                        <div className="form-group padding-right">
                                            <label>STATE<span className="star">*</span></label>
                                            <SearchAndSelect inputClasses="form-control" options={states} onSelect={(state)=>this.onStateChange(state)} onInputChange={(state)=>this.onStateChange(state)} inputFieldValue={this.state.state} />
                                            {this.state.stateError && this.state.stateTouched &&
                                                <div className="error">Please select a state from the dropdown</div>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group padding-left">
                                            <label>CITY<span className="star">*</span></label>
                                            <SearchAndSelect inputClasses="form-control" options={cities} onSelect={(city)=>this.onCityChange(city)} onInputChange={(city)=>this.onCityChange(city)} inputFieldValue={this.state.city} disabled={this.state.stateError}/>
                                            {this.state.cityError && this.state.cityTouched &&
                                                <div className="error">Please select a city from the dropdown</div>
                                            }
                                        </div>
                                    </div>
                            </div>
                            <div className="row no-gutters">
                                <div className="col-md-6">
                                    <div className="form-group padding-right">
                                        <label>AGE<span className="star">*</span></label>
                                        <input type="text" className="form-control" value={this.state.age} onChange={(e)=>this.onAgeChange(e.target.value)} placeholder="18+" required/>    
                                        {this.state.ageError && this.state.ageTouched &&
                                            <div className="error">Age must be above 18</div>
                                        }
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group padding-left">
                                        <label>MOBILE<span className="star">*</span></label>
                                        <div className="position-relative">
                                            <span className="text-prefix">+91</span>
                                            <input type="text" style={{paddingLeft:"4rem"}} className="form-control" value={this.state.phone} onChange={(e)=>this.onPhoneChange(e.target.value)} placeholder="" required/>
                                        </div>
                                        {this.state.phoneError && this.state.phoneTouched && 
                                            <div className="error">Please enter a valid 10 digit mobile number</div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>FACEBOOK NAME</label>
                                <input type="text" className="form-control" value={this.state.facebook} onChange={(e)=>this.setState({facebook:e.target.value})} placeholder="" required/>    
                            </div>
                            <div className="form-group">
                                <label>INSTAGRAM USERNAME</label>
                                <div className="position-relative">
                                    <span className="text-prefix">@</span>
                                    <input type="text" style={{paddingLeft:"3rem"}} className="form-control" value={this.state.instagram} onChange={(e)=>this.setState({instagram:e.target.value})} placeholder="" required/>
                                </div>
                            </div>
                            <div className="form-group text-center text-white">
                                <span style={{margin:"auto"}} onClick={()=>this.submitFormData()} className={`btn btn-primary btn-larger ${this.validationError()?"disabled":""}`}>{btnContent}</span>
                            </div>
                            {this.state.serverError &&
                                <div className="error server-error text-center">
                                    {this.state.serverErrorMessage}
                                </div>
                            }
                            {this.state.validationError &&
                                <div className="error validation-error text-center">
                                    Please re-check your fields above.
                                </div>
                            }
                            {this.state.userExistsError &&
                                <div className="error validation-error text-center">
                                    User already registered. Please try logging in.
                                </div>
                            }
                            <div className="form-group text-center">
                                <span className="a" onClick={()=>this.props.changeTabTo("login")}>Login</span> &nbsp;.&nbsp; <span className="a" onClick={()=>this.props.changeTabTo("recover")}>Recover Account</span>
                            </div>
                        </div>
                    </div>  
                    <style jsx>{`
                        .login-form{
                            padding:3rem 5% 0 5%;
                        }
                        .error{
                            margin:0.5rem;
                            font-size: 1.2rem;
                        }
                        .padding-right{
                            padding-right:1rem;
                        }
                        .padding-left{
                            padding-left:1rem;
                        }
                        .star{
                            color:#E86B25;
                        }
                        .text-prefix{
                            position: absolute;
                            left: 1rem;
                            top: 0.9rem;
                        }
                        @media only screen and (max-width:768px){
                            .padding-left{
                                padding-left:0;
                            }
                            .padding-right{
                                padding-right:0;
                            }
                        }
                    `}</style>
            </>
        )
    }
}
function mapStateToProps({common}){
    return {common}
}
export default connect(mapStateToProps,{changeTabTo,login,showAuth})(Signup)