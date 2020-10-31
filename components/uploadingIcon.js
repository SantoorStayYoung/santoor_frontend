export default function UploadingIcon({show,width,height,weight,centered}){
    return (
        <>
        <div className="wrapper position-relative">
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            <img src="/images/arrow-top.png" className="arrow" />
        </div>
        <style jsx>{`
            .wrapper{
                display:inline-block;
            }
            .arrow {
                width: 15px;
                position: absolute;
                top: 35px;
                left: 33px;
                animation-name: floating;
                animation-duration: 1.8s;
                animation-iteration-count: infinite;
                animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
            }
            @keyframes floating {
                from { transform: translate(0,  -0px); }
                65%  { transform: translate(0, -5px); }
                to   { transform: translate(0, 0px); }    
            }
            .lds-ring {
                display: inline-block;
                position: relative;
                width: 80px;
                height: 80px;
              }
              .lds-ring div {
                box-sizing: border-box;
                display: block;
                position: absolute;
                width: 64px;
                height: 64px;
                margin: 8px;
                border: 3px solid #E86B25;
                border-radius: 50%;
                animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: #E86B25 transparent transparent transparent;
              }
              .lds-ring div:nth-child(1) {
                animation-delay: -0.45s;
              }
              .lds-ring div:nth-child(2) {
                animation-delay: -0.3s;
              }
              .lds-ring div:nth-child(3) {
                animation-delay: -0.15s;
              }
              @keyframes lds-ring {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
        `}</style>
        </>
    )
}