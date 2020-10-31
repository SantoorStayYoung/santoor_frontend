import Link from 'next/link'
import {connect} from 'react-redux'
import {showAuth,logout,showMenu} from '../redux/actions'
import {NAV_HEIGHT} from '../config'
import Router from 'next/router'
function mobileNavigation(props){
    function loginClick(){
        props.showMenu(false)
        setTimeout(()=>{
            props.showAuth(true,"login")
        },400)
    }
    function registerClick(){
        props.showMenu(false)
        setTimeout(()=>{
            props.showAuth(true,"register")
        },400)
    }
    function logoutClick(){
        props.logout()
        props.showMenu(false)
        Router.push('/');
    }
    return (
        <>
        <div className={`mobile-navigation ${props.common.menuOpen?"show":""}`} style={{height:`calc(${props.common.windowHeight}px)`}}>
            <ul className="main-menu">
                    <li><Link href="/videos"><a onClick={()=>props.showMenu(false)}>Videos</a></Link></li>
                    {props.auth.token?
                        <>
                            <li><Link href="/participant-dashboard"><a className="btn btn-primary btn-register dashboard margin-auto" onClick={()=>props.showMenu(false)}>DASHBOARD</a></Link></li>
                            <li><Link href="/"><a onClick={()=>props.showMenu(false)}>Home</a></Link></li>
                            <li><span className="a cursor-pointer" onClick={()=>logoutClick()}>Logout</span></li>
                        </>
                        :
                        <>
                            <li className="before-cta"><span className="a cursor-pointer" onClick={()=>loginClick()}>Log in</span></li>
                            <li className="cta">
                                <button className="btn btn-primary btn-register margin-auto" onClick={()=>registerClick()}>REGISTER</button>
                            </li>
                        </>
                    }
            </ul>
        </div>
        <style jsx>{`
            .mobile-navigation{
                display:flex;
                flex-direction:column;
                justify-content:center;
            }
            .main-menu{
                list-style:none;
                text-align:center;
                margin-top:-${NAV_HEIGHT};
            }
            .main-menu li{
                margin-bottom:1rem;
            }
            .main-menu li a:not(.btn),.main-menu li .a:not(.btn){
                color:#ffffff;
                font-size:1.1rem;
                text-transform:uppercase;
                font-family:NexaBold,sans-serif;
                padding:1rem 0;
                display:inline-block;
            }
            .main-menu li a:not(.btn):hover,.main-menu li .a:not(.btn):hover{
                text-decoration:none;
            }
            .mobile-navigation{
                background: linear-gradient(90deg,#e86b26,#ec8f2d,#e77228);
                position:fixed;
                width:100%;
                top:${NAV_HEIGHT};
                z-index:100;
                transform: translateX(100%);
                transition:transform 0.4s ease-in-out;
            }
            .mobile-navigation.show{
                transform: translateX(0);
            }
        `}</style>
        </>
    )
}
function mapStateToProps({auth,common}){
    return {auth,common}
}
export default connect(mapStateToProps,{showAuth,logout,showMenu})(mobileNavigation)