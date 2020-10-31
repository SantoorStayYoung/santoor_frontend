import {NAV_HEIGHT} from '../config'
import { connect } from 'react-redux';
function Processing(props){
    return(
        <>
            <div className="max-width-content content" style={{minHeight:`calc(${props.common.windowHeight}px - ${NAV_HEIGHT}`}}>       
                <div className="middle">
                    {props.status=="processing" &&
                        <div>We are processing your video.</div>
                    }
                    {props.status=="validation_error" &&
                        <div>The video you uploaded was larger than 90 seconds. Please try again.</div>
                    }   
                </div>
            </div>
            <style jsx>{`
                .content{
                    min-height:100%;
                    display:flex;
                    flex-direction: column;
                    justify-content: center;
                }
            `}</style>
        </>
    )
}
function mapStateToProps({common}){
    return {common}
}
export default connect(mapStateToProps,null)(Processing)