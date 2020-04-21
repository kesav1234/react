import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Root from './modules/root';
import Plan from './modules/plan';
import Approval from './modules/approval';
import BusinessEvent from './modules/businessEvent';
import MyProfile from './modules/profile';
/* import CreateBusinessEvent from './modules/BusinessEvents/CreateBusinessEvent'; */
// import ChangeRequest from './modules/changeRequest';
import ChangeRequest from './modules/change-request-detail';
import ViewChangePlanDetails from './modules/viewChangePlanDetails';
import ChangeRequestList from './modules/change-request-list'
import UpdateBusinessEvent from './modules/BusinessEvents/UpdateBusinessEvent/UpdateBusinessEvent';
import ViewBusinessEvent from './modules/BusinessEvents/ViewBusinessEvent/ViewBusinessEvent';
import MainMenu from './modules/main-menu';
/* import AddImpact from './modules/Plan/ChangeItem/AddImpact';
import AddContacts from './modules/Plan/Contacts/AddContacts'; */
import Landing from './modules/landing';
import CloseBusinessEvent from './modules/BusinessEvents/UpdateBusinessEvent/closeBusinessEvent';
import ViewChangeFreezeList from './modules/viewChangeFreezeList';
import SearchChangeFreeze from './modules/search-change-freeze';
import SearchChangeContainer from './modules/search-change-container';
import ViewChangePlanList from './modules/Plan/ViewPlanList/ViewChangePlanList';
import EditChangeRequest from './modules/edit-change-request-detail';
import CreateChangeRequest from './modules/CreateChangeRequest';
import api from './api';
import queryString from 'query-string';
import ChangeSchedule from './modules/ChangeSchedule/change-schedule';
import Analytics from './app/molecules/Analytics/analytics';
import CommonErrorHandler from './commonErrorHandler';

import PlanAsp from './modules/planasp';
import EditChangeRequestAsp from './modules/edit-change-asprequest-detail';
import CreateChangeRequestAsp from './modules/CreateChangeRequestAsp';
import ChangeRequestAsp from './modules/change-asprequest-detail';
import ViewChangePlanDetailsAsp from './modules/viewChangePlanDetailsAsp';
import ChangeRequestListAsp from './modules/change-asprequest-list'
import SearchChangeAspContainer from './modules/search-change-asp-container';
import Announcements from './modules/Announcements/announcements';
import ChangePlanTemplateContainer from './modules/Plan/ChangePlanTemplate/ChangePlanTemplateContainer';

const AllRoutes = props => {
  return (   
      <div>        
        <Route exact path="/" component={Root} />
        <Route exact path="/home" component={Landing} />
        <Route exact path="/plan" component={Plan} />
        <Route exact path="/plan/edit/:planId" component={Plan} />
        <Route exact path="/approval" component={Approval} />
        <Route exact path="/createBusinessEvent" component={BusinessEvent} />
        <Route exact path="/my-profile" component={MyProfile} />
        <Route exact path="/my-profile/edit" component={MyProfile} />
        <Route exact path="/changeRequest/:requestId" component={ChangeRequest} />
        <Route exact path="/viewChangePlanDetails/:planId" component={ViewChangePlanDetails} />
        <Route exact path="/change-request-list" component={ChangeRequestList} />
        <Route exact path="/businessevent/:eventId/edit" component={UpdateBusinessEvent} />
        <Route exact path="/businessevent/:eventId" component={ViewBusinessEvent} />
        <Route exact path="/businessevent/:eventId/action/:action" component={CloseBusinessEvent} />
        <Route exact path="/landing" component={Landing} />
        <Route exact path="/viewchangefreezelist" component={ViewChangeFreezeList} />
        <Route exact path="/search-change-freeze" component={SearchChangeFreeze} />
        <Route exact path="/searchchangerequest" component={SearchChangeContainer} />
        <Route exact path="/my-plans" component={Landing} />
        <Route exact path="/my-requests" component={Landing} />
        <Route exact path="/editChangeRequest/:requestId" component={EditChangeRequest} />
        <Route exact path="/createChangeRequest" component={CreateChangeRequest} />
        <Route exact path="/changeSchedule" component={ChangeSchedule} />
        <Route  path="/commonErrorHandler" component={CommonErrorHandler} />
        <Route exact path="/planasp" component={PlanAsp} />
        <Route exact path="/planasp/edit/:planId" component={Plan} />
        <Route exact path="/editChangeRequestAsp/:requestId" component={EditChangeRequestAsp} />
        <Route exact path="/createChangeRequestAsp" component={CreateChangeRequestAsp} />
        <Route exact path="/changeRequestAsp/:requestId" component={ChangeRequestAsp} />
        <Route exact path="/viewChangePlanDetailsAsp/:planId" component={ViewChangePlanDetailsAsp} />
        <Route exact path="/change-asprequest-list" component={ChangeRequestListAsp} />
        <Route exact path="/searchchangerequestasp" component={SearchChangeAspContainer} />
        <Route exact path="/announcements" component={Announcements} />
        <Route exact path="/my-plan-templates" component={ChangePlanTemplateContainer} />
        <Route exact path="/plan-template" component={Plan} />
      </div>  
  )
}

export default AllRoutes