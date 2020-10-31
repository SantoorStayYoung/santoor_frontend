import Link from "next/link";
import { useState } from "react";
import Modal from "../components/modal";
import ContactForm from '../components/contactForm'
export default function Footer() {
  const [modalVisible, showModal] = useState(false);
  function close() {
    showModal(false);
  }
  return (
    <>
      <Modal show={modalVisible} close={close}>
        <ContactForm />
      </Modal>
      <footer className="position-relative">
        <div className="footer-top">
          <div className="footer-logo">
            <img src="/images/SantoorLogoCropped.png" className="footer-logo" />
          </div>
          <div className="footer-social hide-mobile">
            <a
              href="https://www.facebook.com/SantoorStayYoung/"
              target="_blank"
            >
              <img src="/images/FacebookIcon1.svg" />
            </a>
            <a
              href="https://www.instagram.com/santoorstayyoung/"
              target="_blank"
            >
              <img src="/images/InstagramIcon1.svg" />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="left">
            <div className="bold text-white color-inherit-a">
              <a href="https://santoorstayyoung.com" className="underline">
                About Santoor
              </a>
            </div>
            <div className="light text-white about">
              Santoor is the flagship brand of Wipro Consumer Care. Our soaps
              have always been a part of the beauty regimen of Indian women,
              giving them younger looking skin and making them feel youthful.
              Since our inception, we have celebrated the spirit of the Indian
              woman and have supported her in unleashing her talents. Santoor
              Center Stage in our endeavour to give her the spotlight she
              deserves and help her showcase her brillance to the world. Want to
              join in?
            </div>
          </div>
          <div className="right">
            <div className="footer-social-mobile show-only-mobile-block">
              <a
                href="https://www.facebook.com/SantoorStayYoung/"
                target="_blank"
              >
                <img src="/images/FacebookIcon1.svg" />
              </a>
              <a
                href="https://www.instagram.com/santoorstayyoung/"
                target="_blank"
              >
                <img src="/images/InstagramIcon1.svg" />
              </a>
            </div>
            <ul className="bold">
              <li>
                <Link href="/terms-and-conditions">
                  <a>Terms &amp; Conditions</a>
                </Link>
              </li>
              <li>
                <a>Privacy Policy</a>
              </li>
              <li onClick={() => showModal(true)}>
                <span className="cursor-pointer a">
                  Having trouble? Tell us
                </span>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <style jsx>{`
            footer{
                background:#53284f;
                padding: 0 6% 5rem 6%;
            }
            .footer-top{
                display:flex;
            }
            .footer-logo{
                flex:1 calc(50% + 160px);
                text-align:right;
                width:320px;
            }
            .footer-social{
                flex:1 calc(50% - 121px);
                text-align:right;
                margin-left: -2rem;
                margin-right: -2rem;
                padding-top:50px;
            }
            .footer-social-mobile{
                margin-top:3rem;
                margin-bottom:3rem;
                margin-left: -2rem;
                margin-right: -2rem;
            }
            .footer-social img,.footer-social-mobile img{
                margin 0 2rem;
            }
            .footer-bottom{
                display:flex;
            }
            .footer-bottom .left{
                flex: 0 44%;
            }
            .footer-bottom .right{
                flex: 0 56%;
                text-align:right;
            }
            .footer-bottom .right ul{
                list-style:none;
            }
            .footer-bottom .right ul li a,.footer-bottom .right ul li .a{
                color:#ffffff;
                text-decoration:underline;
                display:inline-block;
                margin:0.5rem 0;
                font-size:1.4rem;
            }
            .footer-bottom .right ul li a:hover{
                color:#ffffff;
            }
            .about{
                font-size:1.4rem;
                margin-top:1rem;
                color:#c8bbc6;
            }
            @media only screen and (max-width:768px){
                .footer-top{
                    display:block;
                    text-align:center;
                    padding-top:3rem;
                }
                .footer-logo{
                    width:225px;
                    text-align:center;
                    margin:auto;
                }
                .footer-bottom{
                    display:block;
                    text-align:center;
                }
                .footer-bottom .left{
                    margin-top:3rem;
                    flex:none;
                }
                .footer-bottom .right{
                    flex:none;
                    text-align:center;
                }
                .footer-bottom .right ul{
                    padding-left:0;
                    margin-top:3rem;
                }
            }   
        `}</style>
    </>
  );
}
