import LoadingIcon from './loadingIcon'
import { connect } from 'react-redux'
function FixedLoader(props){
    return (
        <>
        <div className={`wrapper ${props.common.showFixedLoader?"show":""}`}>
            <LoadingIcon show={true} width="2.5rem" height="2.5rem" weight="thin"/>
        </div>
        <style jsx>{`
            .wrapper{
                background:#ffffff;
                border-radius:50%;
                position:fixed;
                top:10rem;
                left:calc(50% - 2.5rem);
                box-shadow:1px 1px 3px #b3b3b3;
                transform:scale(0) translateY(3rem);
                padding:0;
                overflow:hidden;
                transition:all 0.4s; 
            }
            .wrapper.show{
                transform:scale(1) translateY(0);
                padding:1rem;
            }
        `}</style>
        </>
    )
}
function mapStateToProps({common}){
    return {common}
}
export default connect(mapStateToProps,null)(FixedLoader)