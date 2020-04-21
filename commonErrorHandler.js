import React, { Component } from 'react';
import {BrowserRouter as Router,Link,useLocation} from "react-router-dom";
import GlobalHeader from './modules/AccessRequest/GobalHeader';

class CommonErrorHandler extends Component {
handleRedirect = () =>{
	window.location = '/home';
}
  render() {
	  let status = localStorage.getItem('errorStatus');
	  let errorMessage = localStorage.getItem('errorMsg');
	  return(
	  <div>
	  <GlobalHeader infomsg={false} />
	  <div className='errMsg'>{status}</div>
	  <div className='errMsgBtn'><button className="btn request-btn" onClick={this.handleRedirect}>Click here</button> to go back</div>
	  </div>)
  }
}

export default CommonErrorHandler;