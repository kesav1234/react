import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import ActivityCategory from './modules/Admin/ActivityCategory/activity-category';
import ActivityType from './modules/Admin/ActivityType/activity-type';
import { ApprovalGroup } from './modules/Admin/ApprovalGroup';
import ApplicationServiceProvider from './modules/Admin/ApplicationServiceProvider/application-service-provider';
import ContactRole from './modules/Admin/ContactRole/contact-role';
import NetworkSubNetwork from './modules/Admin/Network-SubNetwork/SubNetwork/network-subnetwork';
import RevokeUserAccess from './modules/Admin/RevokeUserAccess';
import ChangeType from './modules/Admin/ChangeType/change-type';
import AdminLanding from './modules/admin-landing';
import AdminSideNavBar from './modules/navigation/admin-side-navbar';
import GlobalHeader from './modules/AccessRequest/GobalHeader';
import Announcements from './modules/Announcements/announcements';

const AdminRoutes = props => {

  return (
    <div>
      <GlobalHeader infomsg={false} />
      <div className="col-md-12">
        <div className='row'>
          <div className="greybg admin-panel">
            <div className="mt2 container-fluid ucm-body bg-color">
              <div className="row">
                <div className="col-md-12 bottom-border">
                  <h2 className="mt10 bold">Administration: Master Data</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-md-2 right-border">
                  <AdminSideNavBar />
                </div>
                <div className="col-md-10 left-border">
                  <Route exact path="/" render={() => <Redirect to={props.url} />} />
                  <Route exact path="/admin/masterdata/" component={AdminLanding} />
                  <Route exact path="/admin/masterdata/activitycategory/" component={ActivityCategory} />
                  <Route exact path="/admin/masterdata/activityType/" component={ActivityType} />
                  <Route exact path="/admin/masterdata/approvalGroup/" component={ApprovalGroup} />
                  <Route exact path="/admin/masterdata/changeType/" component={ChangeType} />
                  <Route exact path="/admin/masterdata/contactRole/" component={ContactRole} />
                  <Route exact path="/admin/masterdata/networkSubNetwork/" component={NetworkSubNetwork} />
                  <Route exact path="/admin/masterdata/serviceprovider/" component={ApplicationServiceProvider} />
                  <Route exact path="/announcements/" component={Announcements} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default AdminRoutes