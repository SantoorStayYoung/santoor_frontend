import {connect} from 'react-redux'
import { Component } from 'react'
import {showAuth,logout,menuBtnClick,showMenu} from '../redux/actions'
import Link from 'next/link'
class Navigation extends Component{
    render(){
        return (
            <>
                <nav className={`${this.props.navColor} ${this.props.navPosition}`}>
                    <div className="logo">
                        <Link href="/">
                            <a>
                                <img src="/images/SantoorLogo.png" />
                            </a>
                        </Link>
                    </div>
                    <div className="main-menu-wrapper">
                        <ul className="main-menu">
                            <li><Link href="/"><a>Home</a></Link></li>
                            <li><Link href="/videos"><a>Videos</a></Link></li>
                            {/* <li><Link href="/videos"><a>Videos</a></Link></li> */}
                            {this.props.auth.token?
                                <>
                                    <li><span className="a cursor-pointer" onClick={()=>{this.props.logout()}}>Logout</span></li>
                                    <li><Link href="/participant-dashboard"><a className="btn btn-primary btn-register dashboard">MY ACCOUNT</a></Link></li>
                                </>
                                :
                                <>
                                    <li className="before-cta" onClick={()=>this.props.showAuth(true,"login")}><span className="a cursor-pointer">Log in</span></li>
                                    <li className="cta">
                                        <button className="btn btn-primary btn-register" onClick={()=>this.props.showAuth(true,"register")}>REGISTER</button>
                                    </li>
                                </>
                            }
                        </ul>
                        <span className={`menu-btn ${this.props.common.menuOpen?"open-nav":""}`} onClick={()=>this.props.menuBtnClick()}>
                            <span className="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </span>
                    </div>
                </nav>
                <style jsx>{`
                    nav{
                        display: flex;
                        flex-flow: row wrap;
                        width: 100%;
                        justify-content: flex-end;
                        position: fixed;
                        z-index: 10;
                        top: 0;
                        position: relative;
                        padding: 0 2.5rem;
                        height: 52px;
                        overflow:hidden;
                    }
                    nav.fixed{
                        position:fixed;
                    }
                    nav.relative{
                        position:relative;
                    }
                    nav.solid{
                        background: linear-gradient(90deg, #e86b26,#ec8f2d, #e77228);
                    }
                    nav.solid .main-menu li a,nav.solid .main-menu li .a{
                        color:#ffffff;
                    }
                    nav.transparent{
                        background: #ffffff57;
                    }
                    .logo{
                        position: absolute;
                        left: 3.5%;
                        top: -10px;
                    }
                    .logo img{
                        width:177px;
                    }
                    .main-menu{
                        position:absolute;
                        right:5.5%;
                        top:${this.props.auth.token?"8px":"8px"};
                    }
                    .main-menu{
                        list-style:none;
                    }
                    .main-menu li{
                        display:inline-block;
                        margin-right:1rem;
                    }
                    .main-menu li a:not(.btn),.main-menu li .a:not(.btn){
                        color:#e86b25;
                        font-size:1.1rem;
                        text-transform:uppercase;
                        font-family:NexaBold,sans-serif;
                        padding:0 2rem;
                    }
                    .main-menu li a::hover{
                        text-decoration:none;
                    }
                    .before-cta{
                        margin-right: 3rem !important;
                    }
                    .dashboard:hover{
                        text-decoration:none;
                    }
                    // .main-menu-wrapper{
                    //     display:flex;
                    //     flex-direction:column;
                    //     justify-content:center;
                    // }
                    .menu-btn{
                        display:none;
                    }
                    .lines {
                        position: relative;
                        display: inline-block;
                        width: 28px;
                        height: 25px;
                        vertical-align: middle;
                        z-index: 1;
                      }
                      .lines span {
                        position: absolute;
                        display: block;
                        height: 2px;
                        width: 100%;
                        background: #ffffff;
                        -webkit-transition: top .2s .25s, left .2s .25s, opacity .2s .25s, -webkit-transform .2s 0s;
                        transition: top .2s .25s, left .2s .25s, opacity .2s .25s, -webkit-transform .2s 0s;
                        transition: top .2s .25s, left .2s .25s, opacity .2s .25s, transform .2s 0s;
                        transition: top .2s .25s, left .2s .25s, opacity .2s .25s, transform .2s 0s, -webkit-transform .2s 0s;
                      }
                      .lines span:nth-child(2) {
                        top: 11px;
                      }
                      .lines span:nth-child(3) {
                        top: 22px;
                      }
                      .open-nav .lines span:nth-child(1) {
                        -webkit-transform: rotate(45deg);
                        transform: rotate(45deg);
                        top: 11px;
                      }
                      .open-nav .lines span:nth-child(2) {
                        opacity: 0;
                      }
                      .open-nav .lines span:nth-child(3) {
                        -webkit-transform: rotate(-45deg);
                        transform: rotate(-45deg);
                        top: 11px;
                      }
                    @media only screen and (max-width: 768px){
                        .main-menu{
                            display:none;
                        }
                        .menu-btn{
                            display:block;
                            padding: 14px 15px 13px 15px;
                        }
                        nav{
                            padding: 0 0 0 2.5rem;
                        }
                    }
                `}</style>
            </>
        )
    }
}
function mapStateToProps({auth,common}){
    return {auth,common}
}
export default connect(mapStateToProps,{showAuth,logout,menuBtnClick})(Navigation)