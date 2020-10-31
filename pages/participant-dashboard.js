import {Component} from 'react'
import PrivateContent from '../components/private'
import Layout from '../components/layout'
import {connect} from 'react-redux'
import Upload from '../components/upload'
import Dashboard from '../components/dashboard'
import {API_URI,TOKEN_VAR_NAME,NAV_HEIGHT} from '../config'
import {showFixedLoader} from '../redux/actions'
import isEmpty from 'lodash/isEmpty'
import Head from 'next/head'
class ParticipantDashboardContent extends Component{
    constructor(props){
        super(props)
        // this.state = {status:null,info:null,ready:false}
        this.state = {status:null,info:null,ready:true}
    }
    getStatus = ()=>{
        this.props.showFixedLoader(true)
        fetch(`${API_URI}/api/dashboard/status`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem(TOKEN_VAR_NAME),
            }
        })
        .then(res=>res.json())
        .then(result=>{
            if(result.status=="OK"){
                if(isEmpty(result.videos)){
                    this.setState({status:"new"})
                }
                else{
                    this.setState({status:result.videos.filestat,info:result.videos})
                }
            } else {
                this.setState({status:"error"})
            }
            this.setState({ready:true})
            this.props.showFixedLoader(false)
        }).catch(err=>{
            console.log(err)
            this.setState({ready:true,status:"error"})
            this.props.showFixedLoader(false)
        })
    }
    componentDidMount(){
        this.getStatus()
    }
    setDelRequest = (val)=>{
        let info = JSON.parse(JSON.stringify(this.state.info))
        info.delrequest = val
        this.setState({info})
    }
    render(){
        return (
            <>
                <div className={`video-upload-wrapper ${this.state.ready?"show":""}`} style={{minHeight:`calc(${this.props.common.windowHeight}px - ${NAV_HEIGHT}`}}>
                    {(this.state.status==0 || this.state.status==1 || this.state.status==2 || this.state.status==3 || this.state.status==5 || this.state.status==6 || this.state.status==7 || this.state.status==8 || this.state.status=="new") &&
                        <Upload status={this.state.status} set={(state)=>this.setState(state)} info={this.state.info}/>
                    }
                    {this.state.status==4 &&
                        <Dashboard info={this.state.info} setDelRequest={(val)=>this.setDelRequest(val)}/>
                    }
                </div>
                <style jsx>{`
                    .video-upload-wrapper {
                        text-align: center;
                        opacity:0;
                        transition:opacity 0.7s;
                    }
                    .video-upload-wrapper.show{
                        opacity:1;
                    }
                `}</style>
            </>
        )
    }
}
function mapStateToProps({common}){
    return {common}
}
const ConnectedParticipantDashboardContent = connect(mapStateToProps,{showFixedLoader})(ParticipantDashboardContent)
function ParticipantDashboard(){
    return (
        <Layout mainContentPadding={true} navColor="solid" navPosition="fixed"> 
            <Head>
                <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                !function(f,b,e,v,n,t,s)
                                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                n.queue=[];t=b.createElement(e);t.async=!0;
                                t.src=v;s=b.getElementsByTagName(e)[0];
                                s.parentNode.insertBefore(t,s)}(window, document,'script',
                                'https://connect.facebook.net/en_US/fbevents.js');
                                fbq('init', '634163057296297');
                                fbq('track', 'PageView');
                            `,
                        }}
                /> 
            </Head>
            <PrivateContent>
                <ConnectedParticipantDashboardContent />
            </PrivateContent>
        </Layout>
    )
}
export default ParticipantDashboard