import {useRef,useState} from 'react'
import {
    EmailShareButton,
    FacebookShareButton,
    WhatsappShareButton,
} from "react-share";
export default function Share(props){
    const linkRef = useRef(null);
    const [copyText,setCopyText] = useState("COPY LINK")
    function copyLink(){
        linkRef.current.select()
        linkRef.current.setSelectionRange(0, 99999);
        document.execCommand('copy');
        setCopyText("COPIED!")
        setTimeout(()=>{
            setCopyText("COPY LINK")
        },3000)
    }
    return (
        <>
            <div className="share-options">
                <span className="copy-link inline-element-desktop"><input className="link" ref={linkRef} type="text" value={props.url} /><span className="copy-link-label bold" onClick={()=>copyLink()}>{copyText}</span></span>
                <span className="share-icons inline-element">
                    <EmailShareButton url={props.url}>
                        <span className="share-icon inline-element"><img src="/images/gmail.svg" /></span>
                    </EmailShareButton>
                    <WhatsappShareButton url={props.url}>
                        <span className="share-icon share-icon-whatsapp inline-element"><img src="/images/Watsapp@2x.png" /></span>
                    </WhatsappShareButton>
                    <FacebookShareButton url={props.url}>
                        <span className="share-icon inline-element"><img src="/images/Facebook.svg" /></span>
                    </FacebookShareButton>
                </span>
            </div>
            <style jsx>{`
                .copy-link{                
                    border: 1px solid #afadad;
                    padding: 0.7rem 1rem;
                    width: calc(100% - 18rem);
                    position: relative;
                    text-align: left;
                    display: inline-block;
                    line-height: 1.9;
                }
                .copy-link-label {
                    color: #53284F;
                    font-size: 1.2rem;
                    margin-top: 0.3rem;
                    cursor: pointer;
                    position: absolute;
                    right: 0.5rem;
                    top: 0.7rem;
                }
                .link{
                    overflow: scroll;
                    display: flex;
                    flex-flow: row nowrap;
                    color: #918F8F;
                    width: calc(100% - 10rem);
                    word-break: keep-all;
                    padding: 0rem 0;
                    height: 3rem;
                    border: none;
                }
                .link:focus{
                    outline:none;
                }
                .react-share__ShareButton{
                    
                }
                .share-icons .share-icon:first-child{
                    margin-left:1rem;
                }
                .share-icon{
                    background: #F3F3F3;
                    padding: 1.1rem;
                    margin: 0 0.5rem;
                }
                .share-icon-whatsapp{
                    padding:0.6rem;
                }
                .share-icon img{width:20px}
                .share-icon-whatsapp img{
                    width:30px;
                }
            `}</style>
        </>
    )
}