import "@babel/polyfill";
import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import IdleTimer from 'react-idle-timer';
import { instanceOf } from 'prop-types';
import Routes from './routes';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api, { newAxiosInstance } from './api';
import config from './config';
import Loading from "./modules/AccessRequest/Loader";
import TimeoutWarningModal from "./modules/Modals/TimeoutWarningModal/TimeoutWarningModal";
import * as Constants from './Constants';
import { connect } from 'react-redux';
import * as actions from './modules/AccessRequest/redux/actionCreators';

class App extends Component {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      showTimeoutModal: false,
      isAuthenticated: false,
      approvalStatus: '',
      /*  
        MSJVA 765   
        added activeStatus state 
      */
      activeStatus:false ,
      loader: true,
      seconds: 0
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.idleTimer = null
    this.onAction = this.onAction.bind(this)
    this.onActive = this.onActive.bind(this)
    this.onIdle = this.onIdle.bind(this)
  }

  onAction(e) {
    const { cookies } = this.props;
    // console.log('user did something', e)
    // console.log('Kirke on action time remaining', this.idleTimer.getRemainingTime())
  }
 
  onActive(e) {
    const { cookies } = this.props;
    // console.log('user is active', e)
    // console.log('Kirke user is active time remaining', this.idleTimer.getRemainingTime())
  }
 
  onIdle(e) {
    /// console.log('user is idle', e)
    // console.log('last active', this.idleTimer.getLastActiveTime())
    const { cookies } = this.props;
    // console.log('cooke info', cookies.get('TimerFlag'));
    this.setState({ showTimeoutModal : true });
  }

  
  handleConfirmation(flag, counter) {
    this.setState({ showTimeoutModal : false });
    if (flag === 'yes' && counter > 0) {
      // MSJVA 194
      // Kirkekeepalive();
      // MSJVA 194 ends
      this.idleTimer.reset();
    } else if (flag === 'no') {
      window.location.assign(config.logoutUrl);      
    } else if (flag === 'close') {
      window.location.assign(config.logoutUrl);      
    } else if (counter <= 0) {
      window.location.assign(config.logoutUrl);
    }
  }

  componentWillMount() {
    const path = window.location.pathname;
    const unrestrictedPaths = [
      '/externalAccessApproval',
      '/liveness',
      '/readiness'
    ];
    if (!unrestrictedPaths.includes(path)) this.tokenExchange();
    else this.setState({ isAuthenticated: false, loader: false });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props || nextState !== this.state) {
      return true;
    }
    return false;
  }

  tokenExchange() {
    const { cookies } = this.props;
    cookies.set('TimerFlag', 1);

    // For local development, pass naked vzid as such:
    // http://localhost:3000?username=vzid where vzid is your vzid.
    let userInfoEndpoint = 'userInfo';
    if (window.location.host.includes('localhost')) userInfoEndpoint += window.location.search;

    api.get(userInfoEndpoint).then(response => {
      if (response.data) {
        //Storing User Info To Validate User as isAdmin or Not in Create Change Plan
        this.props.setUserInfo(response.data);
        // This code is for fixing MSJVA - 192 
        localStorage.setItem('lastLoginTimeStamp', response.data.lastLoginTimeStamp ? JSON.stringify(response.data.lastLoginTimeStamp) : '')
        // This code is for fixing MSJVA - 192 ends here
        const approvalStatus = response.data.approvalStatus;
        /* 
          MSJVA 765 
          Getting active status from microservice
        */
        const activeStatus = response.data.active;
        const uid = response.data.id;
        const accessToken = response.data.userAccessTokenInfo ? response.data.userAccessTokenInfo.access_token : null;
        // MSJVA Task/api-security-jwt-imp 
        const jwtToken = response.data.userAccessTokenInfo.jwtToken ? response.data.userAccessTokenInfo.jwtToken : null;
        if (accessToken && jwtToken) {
          config.token = accessToken;
          config.jwtToken = jwtToken;
          api.defaults.headers["jwtToken"] = jwtToken;
          newAxiosInstance.defaults.headers['Authorization'] = `Bearer ${jwtToken}`
          api.defaults.headers['Authorization'] = "Bearer " + accessToken;
          api.defaults.headers['uid'] = uid;
          // newAxiosInstance.defaults.headers['uid'] = uid;
          // MSJVA Task/api-security-jwt-imp ends here
          this.setState({
            isAuthenticated: true,
            loader: false,
            approvalStatus: approvalStatus,
            /* 
              MSJVA 765 
              Setting active status into  state
            */
            activeStatus: activeStatus,
            seconds: response.data.userAccessTokenInfo.expires_in
          }, () => this.startTimer());
        } else {
          this.setState({ isAuthenticated: false, loader: false });
        }
      } else {
        this.setState({ isAuthenticated: false, loader: false });
      }
    }).catch(error => {
      this.setState({ isAuthenticated: false, loader: false });
    })

    api.interceptors.response.use(function (response) {
      return response;
    }, function (error) {
      let status = error.response ? (error.response.status ? error.response.status : '') : ''
      if (status === 401) {
        toast.error('Your role is not authorized to perform this action.');
      }
      return Promise.reject(error);
    });
  }

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.state.seconds = seconds;
    // Check if we're at zero.
    if (seconds == 0) {
      clearInterval(this.timer);
    } else if (seconds == 5) {
      this.tokenExchange();
    }
  }

  render() {
    return (
      <div>
        <TimeoutWarningModal showTimeoutModal={this.state.showTimeoutModal} handleConfirmation={(flag, counter)=> this.handleConfirmation(flag, counter)} />
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={Constants.SSO_DEBOUNCE}
          timeout={Constants.SSO_TIMEOUT_IN_MILLI_SECONDS * Constants.SSO_TIMEOUT_IN_SECONDS * Constants.SSO_TIMEOUT_IN_MIN} />
          
        {this.state.loader ? 
          <Loading /> : 
          <Routes 
            status={this.state.approvalStatus}
            /*
              MSJVA 765 passing activeStatus to Routes component
            */
            activeStatus={this.state.activeStatus}
          />
        }
       
        <ToastContainer
          hideProgressBar={true}
          className='toast-container'
          autoClose={5000}
          newestOnTop={true}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { access: state.access };
}

export default connect(mapStateToProps, actions)(withCookies(App));