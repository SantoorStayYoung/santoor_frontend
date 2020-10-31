import Head from 'next/head'
import {Component} from 'react'
import Navigation from './navigation'
import Footer from './footer'
import {setWindowParams,showAuth,login,logout,setAttemptingLogin,showFixedLoader,vote} from '../redux/actions'
import {connect} from 'react-redux'
import Auth from './auth'
import {API_URI,NAV_HEIGHT,TOKEN_VAR_NAME,MOBILE_BREAKPOINT} from '../config'
import FixedLoader from './fixedLoader'
import MobileNavigation from './mobileNavigation'
import Modal from './modal'
import Vote from './vote'

class Layout extends Component{
    constructor(props){
        super(props)
        this.state = {mode:"portrait"}
    }
    windowSet = ()=>{
        this.props.setWindowParams(window.innerWidth,window.innerHeight)
    }
    handleResize = ()=>{
        // if(window.innerWidth < window.innerHeight){
        //     let mode = window.innerWidth < window.innerHeight?"portrait":"landscape"
        //     if(mode!=this.state.mode){
        //         this.windowSet()
        //         this.setState({mode})
        //     }
        // } else {
            this.windowSet()
        //}
    }
    overlayClick = ()=>{
        this.props.showAuth(false)
    }
    login = (result)=>{
        this.props.login(result.isValidMobile,result.isValidEmail,result.token,result.email,result.phone,result.name)
    }
    tokenLogin = async ()=>{
        this.props.setAttemptingLogin(true)
        this.props.showFixedLoader(true)
        let token = localStorage.getItem(TOKEN_VAR_NAME)
        if(token){
            //connect with server and check validity and expiry
            let res = await fetch(`${API_URI}/api/auth/is_token_valid`, {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({token}) 
            })
            let result = await res.json()
            if(result.status == "OK"){
                this.login(result)   
            }
            else{
                this.props.logout()
            }
            this.props.setAttemptingLogin(false)
            this.props.showFixedLoader(false)
        } else { 
            this.props.setAttemptingLogin(false)
            this.props.showFixedLoader(false)
        }
    }
    componentDidMount(){
        this.windowSet()
        this.setState({mode:window.innerWidth < window.innerHeight?"portrait":"landscape"})
        window.addEventListener('resize',this.handleResize)
        if(!this.props.auth.token)
        this.tokenLogin()
    }
    componentWillUnmount(){
        window.removeEventListener('resize',this.handleResize)
    }
    render(){
        let overlay_class = this.props.common.authShown?"show":""
        return (
            <div className="main-wrapper">
                <Head>
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="Santoor Centre Stage Season 2" />
                    <meta property="og:description" content="Celebrating the spirit of talented Indian Women" />
                    <meta name="title" content="Santoor Centre Stage Season 2" />
                    <meta name="description" content="Celebrating the spirit of talented Indian Women" />
                    <meta property="og:image" content="https://centrestage2.santoorstayyoung.com/images/santoorcentrestage.jpg" />
                    <link rel="shortcut icon" href="favicon.ico" />
                </Head>
                <Auth page={this.props.page}/>
                <Navigation navColor={this.props.navColor} navPosition={this.props.navPosition}/>    
                <MobileNavigation /> 
                <FixedLoader />
                <Modal show={this.props.common.vote} close={()=>this.props.vote(false)}>
                    {this.props.common.vote &&
                        <Vote videoid={this.props.common.vote}/>
                    }
                </Modal>
                <main className={`main-content ${this.props.mainContentPadding?"padding":""}`} style={{minHeight:`calc(${this.props.common.windowHeight}px - ${NAV_HEIGHT})`}}>
                    {this.props.children}          
                </main> 
                <Footer />
                <style jsx>{`
                    .content-overlay.show{
                        z-index: 100;
                        opacity:1;
                    }
                    .content-overlay{
                        position: fixed;
                        z-index:-1;
                        opacity:0;
                        transition:opacity 0.2s;
                        width: 100%;
                        height: ${this.props.common.windowHeight}px;
                        top: 0;
                        left: 0;
                        background: #ffffff85;
                    }
                    .main-content.padding{
                        padding-top: ${NAV_HEIGHT}
                    }
                `}</style>
            </div>
        )
    }
}
function mapStateToProps({common,auth}){
    return {common,auth}
}
export default connect(mapStateToProps,{setWindowParams,showAuth,setAttemptingLogin,login,logout,showFixedLoader,vote})(Layout)
