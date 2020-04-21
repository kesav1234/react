import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Root from './modules/root';
import Analytics from './app/molecules/Analytics/analytics';
import AllRoutes from './all-routes';
import AdminRoutes from './admin-routes';
import AdminUserManagementRoutes from './admin-user-management-routes';
import ExternalAccessApproval from './modules/Approval/ExternalAccessApproval';
import Liveness from './modules/liveness';
import Readiness from './modules/readiness';

const Routes = props => {
  return (
    <Router>
      <div>
        <Switch>
           <Route exact path="/externalAccessApproval" component={ExternalAccessApproval} />
           <Route exact path="/liveness" component={Liveness} />
           <Route exact path="/readiness" component={Readiness} />
          {
            /* 
              MSJVA 765 
              checking for activeStatus into condition 
            */
          }
         {props.status === 'A'  && props.activeStatus ===true?
           <div>
           <Route exact path="/(admin/masterdata)/*" component={AdminRoutes} />
           <Route exact path="/admin/usermanagement/*" component={AdminUserManagementRoutes} />
           <Route component={AllRoutes} />
           </div> : 
            <Route  path="/" component={Root} /> 
           }
        </Switch>

        <Analytics />
      </div>
    </Router>
  )
}

export default Routes