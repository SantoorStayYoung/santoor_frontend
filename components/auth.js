import {Component} from 'react'
import Login from './login'
import Register from './register'
import Verification from './verification'
import Recover from './recover'
import { connect } from 'react-redux'
import {showAuth} from '../redux/actions'
import Modal from '../components/modal'
import { times } from 'lodash'
class Auth extends Component {
    close = ()=>{
        this.props.showAuth(false)
    }
    render(){
        let {authTab,authShown,page} = this.props
        return(
            <>
                <Modal show={authShown} close={this.close}>
                    {authTab=="login" &&
                        <Login page={page} />
                    }
                    {authTab=="register" && 
                        <Register page={page} />
                    }
                    {authTab=="verification" && 
                        <Verification type="phone"/>
                    }
                    {authTab=="emailVerification" && 
                        <Verification type="email" />
                    }
                    {authTab=="recover" && 
                        <Recover page={page} />
                    }
                </Modal> 
                <style jsx>{`
                
                    
                `}</style>
            </>
        )
    }
}
function mapStateToProps({common}){
    let {authTab,authShown} = common
    return {
        authTab,
        authShown
    }
}
export default connect(mapStateToProps,{showAuth})(Auth)