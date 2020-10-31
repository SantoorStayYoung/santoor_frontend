import Head from "next/head";
import { connect } from "react-redux";
import React from "react";
import Layout from "../components/layout";
import Slider from "react-slick";
import VideoEmbed from '../components/videoEmbed'
import VideoInfo from '../components/videoInfo'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronRight,faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import {showAuth} from '../redux/actions'
import Modal from '../components/modal'
import {API_URI} from '../config'
class Home extends React.Component {
  constructor(props){
    super(props)
    this.slider = React.createRef()
    this.latestVideosSlider = React.createRef()
    this.state = {latestVideos:[],mode:"",showNicole:false,showSonal:false,showSwetha:false,sliderWidth:"100%",sliderHeight:"100vh"}
  }
  sliderSizeSet = ()=>{
    this.setState({sliderWidth:`${window.innerWidth}px`,sliderHeight:`${0.9 * window.innerHeight}px`})
  }
  handleResize = ()=>{
        let mode = window.innerWidth < window.innerHeight?"portrait":"landscape"
        if(mode!=this.state.mode){
            this.sliderSizeSet()
            this.setState({mode})
        }
  }
  fetchLatestVideos = ()=>{
    fetch(`${API_URI}/api/dashboard/all_videos`, {
      method: 'POST',
      headers: {
          "Content-Type": "application/json"
      },
      body:JSON.stringify({pageNumber: 1,nPerPage: 10})
    })
    .then(res=>res.json())
    .then(result=>{
        this.setState({latestVideos:result.videos.data})
    }).catch(err=>{
        console.log(err)  
    })
  }
  componentDidMount(){
    this.sliderSizeSet()
    this.setState({mode:window.innerWidth < window.innerHeight?"portrait":"landscape"})
    window.addEventListener('resize',this.handleResize)
    this.fetchLatestVideos()
  }
  componentWillUnmount(){
      window.removeEventListener('resize',this.handleResize)
  }
  render() {
    let { windowHeight } = this.props.common;
    const settings = {
      arrows:false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      // autoplay:true,
      autoplaySpeed: 3000
    }
    var latestVideosSliderSettings = {
      arrows:false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    }
    return (
      <Layout
        page="home"
        navColor="solid"
        navPosition="fixed"
        mainContentPadding={true}
      >
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
        <Modal show={this.state.showSwetha} close={()=>this.setState({showSwetha:false})}>
            <div className="judge-image-modal">
              <img src="/images/swetha2.png" />
            </div>
            <div className="judge-desc text-center">
              Swetha has won the hearts of audiences on singing shows like “Padana Telugu Pata”, “Alapana”, and other Festive Events and Game Shows. Currently, she runs her own YouTube channel where she shares her talent in a refreshing way. 
            </div>
        </Modal>
        <Modal show={this.state.showSonal} close={()=>this.setState({showSonal:false})}>
            <div className="judge-image-modal">
              <img src="/images/sonal2.png" />
            </div>
            <div className="judge-desc text-center">
              Sonal is a former actor and Miss Kerala runner-up. Her passion for dance and choreography led her to co-found Team Naach (a dance company) with Nicole. Today, Team Naach caters to students across India, and has over 3.8 million subscribers on their YouTube channel!
            </div>
        </Modal>
        <Modal show={this.state.showNicole} close={()=>this.setState({showNicole:false})}>
            <div className="judge-image-modal">
              <img src="/images/nicole2.png" />
            </div>
            <div className="judge-desc text-center">
                Nicole took a leap of faith and left her career as a PR professional to follow her passion for dance! She loves to travel, explore cuisines and document her experiences through vlogs. She's the co-founder of Team Naach, a dance company catering to students across India, that has over 3.8 million subscribers on their YouTube channel!
            </div>
        </Modal>
        <Head>
          <title>Santoor Center Stage 2</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="slider position-relative">
          <div className="slide-left slide-control">
            <span className="arrow-left" onClick={()=>this.slider.current.slickPrev()}>
                <FontAwesomeIcon icon={faChevronLeft} className="fa" />
            </span>
          </div>
          <div className="slide-right slide-control">
            <span className="arrow-right" onClick={()=>this.slider.current.slickNext()}>
                <FontAwesomeIcon icon={faChevronRight} className="fa" />
            </span>
          </div>
          <div className="mnemonic-wrapper">
                <div className="mnemonic">
                    <img src="/images/mnemonic-desktop.png" />
                    <div className="orange-box text-white">
                      <span className="bold main-text">Celebrating the spirit of talented Indian women</span>
                      <div className="text-center">
                      {this.props.auth.token?
                        <div style={{marginTop:"2rem"}}>
                          <Link href="/participant-dashboard"><a className="btn btn-primary btn-larger margin-auto dashboard">GET STARTED</a></Link>
                        </div>
                        :
                        <button className="btn btn-primary btn-larger margin-auto" style={{marginTop:"2rem"}} onClick={()=>this.props.showAuth(true,"register")}>REGISTER NOW</button>
                      }
                      </div>
                    </div>
                </div>
          </div>
          <Slider {...settings} ref={this.slider}>
            <div className="slide slide3">
            </div>
            <div className="slide slide1">
            </div>
            <div className="slide slide2">
            </div>
          </Slider>
        </div>
        <div className="section-2 padded-content position-relative">
          <div className="logo-and-text">
            <img src="/images/SantoorLogoCropped.png" className="l"/>
            <div className="text">
              <div className="text1 purple light">Show us</div>
              <div className="text2 purple bold">your talent</div>
            </div>
            <div class="clear"></div>
          </div>
          <div className="talents">
            <div className="row no-gutters">
              <div className="col-md">
                <div className="talent talent-1">
                  <img src="/images/talent-1.png" />
                  <div className="text purple bold">Play an instrument</div>
                </div>
              </div>
              <div className="col-md">
                <div className="talent talent-2">
                  <img src="/images/talent-2.png" />
                  <div className="text purple bold">Sing us a song</div>
                </div>
              </div>
              <div className="col-md">
                <div className="talent talent-3">
                  <img src="/images/talent-3.png" />
                  <div className="text purple bold">
                    Dance to your own rhythm
                  </div>
                </div>
              </div>
            </div>
            <div className="talent-text-section additional-padding purple text-center">
              <h2>Unleash your talent</h2>
              <div style={{marginTop:"2.5rem"}}>
                <p>
                  This year has been a challenging one for you and for many
                  women, juggling between work, family and personal time.
                  Despite the pressures, we at Santoor, continue to be amazed by
                  your wonderful spirit – of how you’ve taken this time, and
                  nurtured your skills and talent. </p>
                  <p>Santoor Centre Stage 2 offers
                  you the chance to shine in the spotlight and show the world
                  the talent you’ve honed. Just share a video to show us any
                  talent that can be judged by seeing it or hearing it. Stand a
                  chance to win big!</p>
                  <div style={{marginTop:"5rem"}} className="text-center">
                    {this.props.auth.token?
                      <Link href="/participant-dashboard"><a className="btn btn-primary btn-larger margin-auto dashboard">GET STARTED</a></Link>
                      :
                      <button type="button" className="btn btn-primary margin-auto btn-larger" onClick={()=>this.props.showAuth(true,"register")}>REGISTER NOW</button>
                    }
                  </div>
              </div>
            </div> 
          </div>
          <div className="five-things">
              <h2 className="uppercase purple">5 THINGS TO KNOW BEFORE YOU ENTER THE CHALLENGE</h2>
              <div className="image-and-text">
                <div className="row no-gutters">
                  <div className="col-md-6">
                    <div className="five-things-image">
                        <img src="/images/five-things.png" className="width-100"/>
                    </div>
                  </div>
                  <div className="col-md-6" style={{display: "flex",flexDirection:"column",justifyContent: "center"}}>
                    <div className="five-things-text purple">
                        <p>Contest is open for women of 18 years and above.</p> 
                        <p>Submit a video (max. 90 seconds) showing us your best talent.</p>
                        <p>Ensure that the talent is something that can be judged by seeing it or hearing it.</p>
                        <p>Get your family and friends to vote for you to reach the Top 15 most-voted videos and be a part of the Finalists.</p>
                        <p>Our panel of Judges will pick three winners from the Finalists.</p> 
                        <p>They will also select three videos from the rest of the entries for the Judges’ Choice Awards.</p> 
                        <p>Like/follow the Santoor <a href="https://www.facebook.com/SantoorStayYoung/" target="_blank">Facebook</a> and <a href="https://www.instagram.com/santoorstayyoung" target="_blank">Instagram</a> pages for contest updates.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <img src="/images/howtotop.png" className="how-to-top-img" />
        </div>
        <div className="how-to padded-content additional-padding text-center">
              <h2 className="uppercase purple">How to participate</h2>
              <div className="orange how-to-sub-heading">We’ve put together a few simple tips on how to shoot and upload your videos. Good luck!</div>
              <div className="how-to-video">
                <VideoEmbed videoid="464469350" />
              </div>
              {/* <div className="how-to-stats purple">
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <div className="stat">
                        <div className="stat-title light">Uploads</div>
                        <div className="stat-count bold">30,010</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="stat">
                        <div className="stat-title light">Total Views</div>
                        <div className="stat-count bold">2,18,652</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="stat">
                        <div className="stat-title light">Days Left</div>
                        <div className="stat-count bold">17</div>
                      </div>
                    </div>
                  </div>
              </div> */}
        </div>
        <div className="get-votes">
          <div className="large-heading text-center show-only-mobile-block bold purple get-most-votes">Get the <br/>most votes</div>
          <div className="row no-gutters">
            <div className="col-md-3 col-5 text-right">
              <div className="mobile-image">
                <img src="/images/Mobile1.png" className="max-width-100"/>
              </div>
            </div>
            <div className="col-md-5 col-6">
              <div className="middle">
                <div className="large-heading bold purple show-only-desktop-block" style={{lineHeight:1}}>Get the<br/>most<br/>votes</div>
                <div className="middle-text orange">
                  <p>Upload your talent video and share the link with your friends and family.</p>
                  <p>Get them to vote for you, because our Finalists will be chosen from the Top 15 most-voted videos.</p>
                  <div className="uppercase purple bold color-inherit-a" style={{marginTop:"2rem"}}><Link href="/participant-dashboard"><a>Share your talent upload link</a></Link></div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="right show-only-desktop-block">
                  <div className="get-vote-image">
                    <img src="/images/GetVote.png" className="max-width-100"/>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom padded-content position-relative">
            <div className="large-heading bold text-white text-center">Meet our judges</div>
            <div className="judges">
              <div className="row no-gutters">
                <div className="col-md">
                  <div className="judge">
                    <div className="-modal-wrapper">
                      <img src="/images/nicole1.png" className="width-100 -modal"/>
                      {/* <img src="/images/PlayButton1.svg"  className="play-btn" /> */}
                    </div>
                    <div className="judge-name purple bold text-center">
                      Nicole Concessao
                    </div>
                    <div className="judge-designation text-white bold text-center">
                      Dancer, Co-founder Team Naach
                    </div>
                    <div className="judge-explore text-center">
                      <button className="btn btn-primary margin-auto" onClick={()=>this.setState({showNicole:true})}>Explore</button>
                    </div>
                  </div>
                </div>
                <div className="col-md">
                  <div className="judge">
                    <div className="-modal-wrapper">
                      <img src="/images/sonal1.png" className="width-100 judge-image"/>
                      {/* <img src="/images/PlayButton1.svg"  className="play-btn" /> */}
                    </div>
                    <div className="judge-name purple bold text-center">
                      Sonal Devraj
                    </div>
                    <div className="judge-designation text-white bold text-center">
                      Dancer, Co-founder Team Naach
                    </div>
                    <div className="judge-explore text-center">
                      <button className="btn btn-primary margin-auto" onClick={()=>this.setState({showSonal:true})}>Explore</button>
                    </div>
                  </div>
                </div>
                <div className="col-md">
                  <div className="judge">
                    <div className="judge-image-wrapper">
                      <img src="/images/swetha1.png" className="width-100 judge-image"/>
                      {/* <img src="/images/PlayButton1.svg"  className="play-btn" /> */}
                    </div>
                    <div className="judge-name purple bold text-center">
                      Swetha Naidu 
                    </div>
                    <div className="judge-designation text-white bold text-center">
                      Singer, Dancer, <br/>YouTuber
                    </div>
                    <div className="judge-explore text-center">
                      <button className="btn btn-primary margin-auto" onClick={()=>this.setState({showSwetha:true})}>Explore</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="logo-and-text">
              <img src="/images/SantoorLogoCropped.png" />
              <div className="text text-right win-big">
                <div className="text1 purple light">WIN BIG</div>
                <div className="text2 purple bold">with Santoor</div>
              </div>
              <div class="clear"></div>
            </div>
            <div className="show-only-mobile-block text-center" style={{marginTop:"2rem"}}>
                    <div className="gold-line"></div>
                    <div className="text-white" style={{marginTop:"3rem"}}>
                        Our Judges will select 3 Winners from the Finalists (Top 15 most-voted entries) and give away Gift Vouchers.
                    </div>
                    <div className="bold text-white" style={{marginTop:"3rem"}}>
                      1st Prize: Rs. 50,000<br />
                      2nd Prize: Rs. 40,000<br />
                      3rd Prize: Rs. 30,000
                    </div>
                    <div className="light text-white" style={{marginTop:"3rem",marginBottom:"3rem"}}>
                        All Finalists get Gift Vouchers worth Rs. 5,000.
                    </div>
                    <div className="gold-line"></div>
            </div>
            <div className="lady-and-text">
              <div className="lady">
                  <img src="/images/lady.png" className="width-100" />
              </div>
              <div className="text text-center">
                <div className="show-only-desktop-block">
                    <div className="gold-line"></div>
                    <div className="text-white" style={{marginTop:"3rem"}}>
                        Our Judges will select 3 Winners from the Finalists (Top 15 most-voted entries) and give away Gift Vouchers.
                    </div>
                    <div className="bold text-white" style={{marginTop:"3rem"}}>
                      1st Prize: Rs. 50,000<br />
                      2nd Prize: Rs. 40,000<br />
                      3rd Prize: Rs. 30,000
                    </div>
                    <div className="light text-white" style={{marginTop:"3rem",marginBottom:"3rem"}}>
                        All Finalists get Gift Vouchers worth Rs. 5,000.
                    </div>
                    <div className="gold-line"></div>
                </div>
                <div className="bold purple additional-text">
                  In addition to the above, the Judges will pick one winner each from all the entries submitted, for the Judges’ Choice Awards. These Winners will get Gift Vouchers worth Rs. 15,000 each.
                </div>
                <div className="text-center">
                {this.props.auth.token?
                  <Link href="/participant-dashboard"><a className="btn btn-primary btn-larger margin-auto dashboard">GET STARTED</a></Link>
                  :
                  <button type="button" className="btn btn-primary margin-auto btn-larger" onClick={()=>this.props.showAuth(true,"register")}>REGISTER NOW</button>
                }
                </div>
              </div>
            </div>
            {this.state.latestVideos.length > 0 &&
            <>
              <div className="latest-videos-gallery position-relative">
                <h1 className="purple text-center" style={{marginBottom:"5rem"}}>TRENDING VIDEOS</h1>
                <Slider {...latestVideosSliderSettings} ref={this.latestVideosSlider}>
                  {this.state.latestVideos.map(video=>{
                      return (
                        <div className="latest-video">
                            <VideoEmbed videoid={video.videoid} />
                            <VideoInfo video={video} />
                        </div>
                      )
                  })}
                </Slider>
                <div className="slide-left slide-control">
                    <span className="arrow-left" onClick={()=>this.latestVideosSlider.current.slickPrev()}>
                        <FontAwesomeIcon icon={faChevronLeft} className="fa" />
                    </span>
                </div>
                <div className="slide-right slide-control">
                    <span className="arrow-right" onClick={()=>this.latestVideosSlider.current.slickNext()}>
                        <FontAwesomeIcon icon={faChevronRight} className="fa" />
                    </span>
                </div>
              </div>
              <div className="text-center" style={{marginTop:"7.5rem"}}>
                  <Link href="/videos"><a className="btn btn-primary btn-larger margin-auto">Explore All</a></Link>
              </div>
            </>
            }
            <img src="/images/footer-top.png" className="footer-top-img" />
        </div>
        <style jsx>{`
          .votes-heading{
            margin-top: 1.5rem;
            font-size: 2.2rem;
          }
          .vote-count{
            font-size: 2.2rem;
          }
          .slide{
            min-height: calc(${this.state.sliderHeight});
            background-size: cover;
            background-position: center;
          }
          .slide1 {
            background-image: url(/images/slide1.jpg);
          }
          .slide2 {
            background-image: url(/images/slide2.jpg);
          }
          .slide3 {
            background-image: url(/images/slide3.jpg);
          }
          .slide-control{
            position: absolute;
            z-index:10;
            top:calc(50% - 1.75rem);
            background: #53284F;
            width: 3.5rem;
            height: 3.5rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: #ffffff;
            border-radius: 10px;
            cursor:pointer;
          }
          .slide-left{
              left:2rem;
          }
          .slide-right{
            right:2rem;
          }
          .mnemonic-wrapper{
            width: 360px;
            position:absolute;
            right:10%;
            text-align:center;
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: center;
          }
          .mnemonic{
            position:relative;
            height: 466px;
          }
          .mnemonic img{
            opacity: 0.95;
            width: 275px;
            margin: auto;
            position: relative;
            z-index: 2;
          }
          .orange-box{
            background-color: #e86b25b0;
            width: 100%;
            text-align: center;
            position: absolute;
            top: 167px;
            z-index: 1;
            padding-top: 128px;
            border-radius: 44px;
            padding-bottom: 46px;
          }
          .orange-box .main-text{
            display: inline-block;
            width: 100%;
            font-size:2rem;
            letter-spacing: 0.1rem;
            padding: 0 5%;
          }
          .section-2 {
            background: url(/images/topbg.png);
            background-position: top left;
            padding-top: 5rem;
            padding-bottom: 5rem;
            background-repeat: repeat-y;
            background-size: auto;
            margin-top: -1rem;
            padding-bottom: 15rem;
            background-size: 100%;
          }
          .logo-and-text {
            // display: flex;
            // flex-flow: row-wrap;
            // justify-content: space-between;
          }
          .logo-and-text .text{
            text-align:right;
            font-size:9rem;
          }
          .text1 {
            line-height: 0.8;
          }
          .text2 {
            line-height: 1;
          }
          .logo-and-text img {
            width: 400px;
            float: left;
          }
          .talents {
            margin-left: -55px;
            margin-right: -55px;
            margin-top: 8rem;
            padding: 0px 12.5%;
          }
          .talents .col-md {
            padding-left: 55px;
            padding-right: 55px;
          }
          .talent {
            padding-top: 130%;
            background: #ffffff;
            position: relative;
          }
          .talent img {
            position: absolute;
          }
          .talent .text {
            position: absolute;
            top: 75%;
            width: 100%;
            text-align: center;
            font-size: 1.4rem;
            padding: 0 5rem;
          }
          .talent-1 img {        
            top: -3%;
            left: -30%;
            width: 130%;
          }
          .talent-2 img {
            top: -16%;
            width: 135%;
            left: -8%;        
          }
          .talent-3 img {
            top: -28%;
            width: 122%;
            left: 0;
          }
          .talent-4 img {
            top: 0rem;
            left: 5%;
            width: 110%;
          }
          .talent-5 img {
            top: -2rem;
            width: 104%;
            left: 5%;
          }
          .talent-text-section{
            margin-top: 8rem;
            font-size:1.62rem;
          }
          .additional-padding{
            padding-left:15%;
            padding-right:15%;
          }
          .additional-padding-2{
            padding-left:12%;
            padding-right:12%;
          }
          .five-things h2{
            padding:0 2.5%;
            text-align:center;
          }
          .five-things{
            margin-top:7.5rem;
          }
          .five-things .image-and-text{
            margin-top:7rem;
          }
          .five-things-text{
            padding-left:12.5rem;
          }
          .how-to{
            background:url(/images/howtobg.png);
            padding-top:5rem;
            padding-bottom: 5rem;
          }
          .how-to-top-img{
            position: absolute;
            bottom: 0rem;
            left: 0;
          }
          .how-to-video{
            width: 700px;
            max-width: 100%;
            margin: 3rem auto 0 auto;
            padding: 1.5rem 2.5rem;
            background: #ffffff;
          }
          .how-to-sub-heading{
            width: 50rem;
            margin: auto;
            margin-top:1rem;
          }
          .how-to-stats{
            margin-top: 5rem;
            font-size: 3rem;
          }
          .mobile-image{
            width:225px;
          }
          .get-votes{
            padding-top: 12rem;
            padding-bottom: 10rem;
            padding-left:10%;
            padding-right:2.5%;
          }
          .get-votes .middle{
            padding-left: 5rem;
          }
          .bottom {
            background: url(/images/BottomBackground.svg);
            background-position: top left;
            padding-top: 5rem;
            padding-bottom: 28rem;
          }
          .latest-videos-gallery{
            margin-top:10rem;
          }
          .latest-video{
            padding:0 1rem;
          }
          .judges {
            margin-left: -60px;
            margin-right: -60px;
            margin-top: 2rem;
            padding: 0px 12.5%;
            margin-bottom: 6rem;
          }
          .judges .col-md {
            padding-left: 60px;
            padding-right: 60px;
          }
          .judge-image-wrapper {
            position: relative;
          }
          .judge-image-wrapper .play-btn{
              position: absolute;
              top: calc(50% - 0px);
              left: calc(50% - 25px);
              width: 50px;
          }
          .judge-name{
            margin-top:2rem;
          }
          .judge-designation{
            margin-top:-0.2rem;
          }
          .judge-explore{
            margin-top:1rem;
          }
          .bottom .logo-and-text{
            margin-top:3rem;
          }
          .lady-and-text{
            display:flex;
            flex-flow:row wrap;
            margin-top:8rem;
          }
          .lady-and-text .lady{
            flex: 0 0 40%;
          }
          .lady-and-text .text{
            flex: 0 0 60%;
            padding-right:8%;
          }
          .gold-line{
            width: 90%;
            margin:auto;
            height: 4px;
            background: transparent radial-gradient(closest-side at 50% 50%, #FFFFFF 0%, #AE7F1E 96%, #AE7F1E 100%) 0% 0% no-repeat padding-box;
          }
          .footer-top-img{
              position: absolute;
              bottom: -1rem;
              width:100%;
              left: 0;
          }
          .bottom .additional-text{
            margin-top:5rem;
            margin-bottom:4rem;
          }
          .get-most-votes{
            margin-bottom:3rem;
          }
          @media only screen and (max-width:768px){
            .slide {
              background-size:auto;
              background-position: center -330px;
            }
            .slide-control{
              // top:auto;
              // bottom: 13rem;
            }
            .mnemonic-wrapper{
                width: 250px;
                right:auto;
                left:calc(50% - 125px);
                // justify-content: flex-end;
            }
            .mnemonic img{
              width: 200px;
            }
            .mnemonic{
              height: 370px;
              // margin-bottom: 3rem;
            }
            .orange-box{
              top: 110px;
              padding-top: 95px;
              padding-bottom: 26px;
            }
            .section-2 .logo-and-text .l{
              display:none;
            }
            .section-2 .logo-and-text .text{
              text-align:center;
            }
            .section-2 .logo-and-text{
              display:block;
            }
            .logo-and-text .text{
              font-size:5rem;
            }
            .talents .col-md {
              padding-left: 30%;
              padding-right: 30%;
            }
            .talents{
              margin-left:-30%;
              margin-right:-30%;
              margin-top:5rem;
            }
            .talent{
              margin-bottom:7rem;
            }
            .talent-text-section{
              margin-top:0;
            }
            .talent .text {
              top: 65%;
            }
            .five-things-text {
              padding-left: 0;
              text-align: center;
              margin-top: 5rem;
            }
            .how-to-top-img{
              left:-200px;
            }
            .how-to-sub-heading{
              width:100%;
              text-align:center;
            }
            .get-votes {
              padding-top: 5rem;
              padding-bottom: 5rem;
              padding-left: 3%;
              padding-right: 3%;
            }
            .get-votes .middle{
              padding-left: 2rem;
            }
            .how-to-stats .stat {
                margin-bottom: 3rem;
            }
            .judges{
              margin-top: 2rem;
            }
            .judge{
              margin-bottom:1rem;
            }
            .bottom .logo-and-text{
              display:block;
            }
            .bottom .logo-and-text img{
              width:100%;
            }
            .bottom .logo-and-text .text{
              text-align:center;
            }
            .bottom .additional-text{
              margin-top:0;
              margin-bottom:4rem;
            }
            .win-big{
              margin:2rem 0;
            }
            .lady-and-text{
              margin-top: 5rem;
            }
            .footer-top-img{
              bottom: 0;
            }
          }
        `}</style>
      </Layout>
    );
  }
}
function mapStateToProps({ common,auth }) {
  return {
    common,
    auth
  };
}
export default connect(mapStateToProps, {showAuth})(Home);
