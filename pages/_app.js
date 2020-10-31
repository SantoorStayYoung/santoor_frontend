import '../styles/global.scss'
import '../styles/bootstrap-grid.min.css'
import '../styles/bootstrap-reboot.min.css'
import "../styles/video-react.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {wrapper} from '../redux/store';
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
export default wrapper.withRedux(MyApp);
