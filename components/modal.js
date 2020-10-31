import {connect} from 'react-redux'
function Modal(props){
    return (
        <>
        <div className={`modalContainer ${props.show?"animateIn":"animateOut"}`} onClick={()=>props.close()} style={{height:`${props.common.windowHeight}px`}}>
            <div style={{height:`${0.8*props.common.windowHeight}px`}} className="modal" onClick={(e)=>e.stopPropagation()}>
                <span className="close" onClick={()=>props.close()}></span>
                {props.children}
            </div>
        </div>
        <style jsx>{`
            .close {
                position: absolute;
                right: 32px;
                top: 32px;
                width: 32px;
                height: 32px;
                opacity: 0.3;
              }
              .close:hover {
                opacity: 1;
              }
        `}</style>
        </>
    )
}
function mapStateToProps({common}){
    return {common}
}
export default connect(mapStateToProps,null)(Modal)