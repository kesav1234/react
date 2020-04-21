import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {unregister} from './registerServiceWorker';
import store from './modules/AccessRequest/redux/store'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/vzw-bootstrap.css';
import './style/vzw-fonts.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'; 
import './App.css';
import { CookiesProvider } from 'react-cookie';
import App from './App'

ReactDOM.render(
  <CookiesProvider>
    <Provider store={store}>
      <App/>
    </Provider>
  </CookiesProvider>,
  document.getElementById('root')
);
unregister();
