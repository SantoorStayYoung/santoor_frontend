export default function LoadingIcon({show,width,height,weight,centered}){
    return (
        <>
        <div className={`loading-icon ${show?"show":""} ${weight} ${centered?"centered":""}`} style={{width,height}}></div>
        <style jsx>{`
            #loading-icon-wrapper{
                position: fixed;
                z-index: 999;
                top: 165px;
                left: calc(50% - 21px);
                background: #ffffff;
                padding: 5px;
                border-radius: 50%;
                box-shadow: 2px 2px 5px #545454;
                text-align: center;
                display:none;
              }
              #loading-icon-wrapper.show{
                display:block;
              }
              .loading-icon {
                border-radius: 50%;
                width: 0;
                height: 0;
                opacity:0;
                transition: all 0.7s;
                -webkit-animation: spin 1s linear infinite;
                animation: spin 1s ease-in-out infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .loading-icon.thin{
                border: 3px solid #ffffff;
                border-top: 3px solid #414142;
              }
              .loading-icon.thick{
                border: 6px solid #ffffff;
                border-top: 6px solid #414142;
              }
              .loading-icon.centered{
                margin:auto;
              }
              .loading-icon.show{
                opacity:1;
              }
        `}</style>
        </>
    )
}