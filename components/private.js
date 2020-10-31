import {connect} from 'react-redux'
import LoadingIcon from './loadingIcon'
import {showAuth} from '../redux/actions'
import FixedLoader from './fixedLoader'
class PrivateContent extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount(){
        setTimeout(()=>{
            if(!this.props.auth.token && !this.props.auth.attemptingLogin)
                this.props.showAuth(true,"login")
            else if(this.props.auth.token && !(this.props.auth.isValidMobile || this.props.auth.isValidEmail))
                this.props.showAuth(true,"verification")
        },1000)
    }
    componentDidUpdate(prevProps){
        if(this.props.attemptingLogin!=prevProps.attemptingLogin){
            if(!this.props.attemptingLogin){
                if(!this.props.auth.token)
                    this.props.showAuth(true,"login")
                if(this.props.auth.token && !(this.props.auth.isValidMobile || this.props.auth.isValidEmail))
                    this.props.showAuth(true,"verification")
            }
        }
    }
    render() {
        let jsx = '';
        if(!this.props.auth.attemptingLogin){
            if(!this.props.auth.token)
                jsx = <div className="text-center" style={{marginTop:"10rem"}}>You must <span style={{textDecoration:"underline"}} onClick={()=>this.props.showAuth(true,"login")} className="cursor-pointer">login</span> to access this page</div>
            else if(this.props.auth.token && !(this.props.auth.isValidMobile || this.props.auth.isValidEmail))
                jsx = <div className="text-center" style={{marginTop:"10rem"}}>You must verify your email or mobile number to access this page. <span style={{textDecoration:"underline"}} onClick={()=>this.props.showAuth(true,"verification")} className="cursor-pointer">Verify now</span>.</div>
            else
                jsx = this.props.children
        }
        return jsx
    }
}
function mapStateToProps({auth}){
    return {auth}
}
export default connect(mapStateToProps,{showAuth})(PrivateContent)