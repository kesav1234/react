import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import RevokeUserAccess from './modules/Admin/RevokeUserAccess';
import AdminUserManagementLanding from './modules/admin-user-management-landing';
import AdminUserManagementNavBar from './modules/navigation/admin-user-management';
import GlobalHeader from './modules/AccessRequest/GobalHeader';

const AdminUserManagementRoutes = props => {
  return (
    <div>
      <GlobalHeader infomsg={false} />
      <div className="col-md-12">
        <div className='row'>
          <div className="greybg admin-panel">
            <div className="mt2 container-fluid ucm-body bg-color">
              <div className="row">
                <div className="col-md-12 bottom-border">
                  <h2 className="mt10 bold">Administration: User Management</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-md-2 right-border">
                   <AdminUserManagementNavBar />
                   </div>
                <div className="col-md-10 left-border">
                  <Route exact path="/" render={() => <Redirect to={props.url} />} />
                  <Route exact path="/admin/usermanagement/" component={AdminUserManagementLanding} />
                   <Route exact path="/admin/usermanagement/revokeaccess/" component={RevokeUserAccess} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default AdminUserManagementRoutes