import _ from 'lodash';
import axios from 'axios';
import config from './../../../../config';
import * as actions from '../actions'
import { toast } from "react-toastify";
import api from './../../../../api';
import * as Constants from './../../../../Constants';

const {
  REVOKE_LOADER,
  LOADER,
  SET_ADMIN_VALUES,
  GET_ALL_ACTIVITY_CATEGORY_VALUES,
  GET_ALL_ACTIVITY_TYPE_VALUES,
  GET_ALL_CHANGE_TYPE_VALUES,
  FORM_ERROR,
  SAVE_ACTIVITY_CATEGORY,
  SAVE_ACTIVITY_TYPE,
  SAVE_CHANGE_TYPE,
  SET_CHANGE_TYPE,
  RESET_SELECTED_CHANGE_TYPE,
  CLEAR_SAVE_CHANGE_TYPE,
  CLEAR_SAVE_ACTIVITY_TYPE,
  CLEAR_SAVE_ACTIVITY_CATEGORY,
  CLEAR_SAVE_NETWORK_SUBNETWORK,
  ADD_EDIT_ACTIVITY_TYPE,
  GET_ALL_ACCESS_USERS,
  CONFIRM_REVOKE_ACCESS,
  SET_SELECTED_ACTIVITY_CATEGORY,
  COMPLETED_EDIT_ACTIVITY_TYPE,
  SHOW_ACTIVITY_TYPE,
  RESET_SELECTED_ACTIVITY_CATEGORY,
  /* MSJVA 740 */
  VIEW_ACTIVITY_TYPE_LOG,
  ACTIVITY_TYPE_HISTORY_AVAILABLE,
  TOGLLE_VIEW_HISTORY_ACTIVITY_TYPE_MODAL,
  /* MSJVA 732 */
  CHANGE_TYPE_HISTORY_AVAILABLE,
  VIEW_CHANGE_TYPE_LOG,
  TOGLLE_VIEW_HISTORY_CHANGE_TYPE_MODAL,
  /*ASP Related fields */
  SET_SELECTED_ASP,
  GET_ALL_ASP_VALUES,
  RESET_SELECTED_ASP,
  CLEAR_SAVE_ASP,
  SAVE_ASP,
  SERVICE_PROVIDER,
  /*Contcaat Role related fields */
  GET_ALL_CONTACT_ROLES,
  SET_SELECTED_CONTACT_ROLE,
  RESET_SELECTED_CONTACT_ROLE,
  CLEAR_SAVE_CONTACT_ROLE,
  SAVE_CONTACT_ROLE,
  DELETE_CONTACT_ROLE,
  EXPIRE_CONTACT_ROLE,
  /* Network Sub-Network */
  GET_ALL_NETWORKS_SUBNETWORKS,
  SAVE_SUB_NETWORK,
  GET_ALL_SUBNETWORK_ASSOCIATIONS
} = actions

export function success(msg) {
  toast.success(msg);
}



export const confirmRevoke = (data) => dispatch => {


  try {

    dispatch({ type: actions.CONFIRM_REVOKE_ACCESS, payload: data });
  } catch (err) {
    failure(Constants.ERROR_OCCURRED)
  }

}

export function revoke(data) {

  return function (dispatch, getState) {
    dispatch({ type: REVOKE_LOADER, payload: true });

    api.put(`/revokeUserAccess`, data)
      .then(response => {
        dispatch({ type: REVOKE_LOADER, payload: false });
        let map = { 'condition': false, 'data': {}, 'revoke': true }
        dispatch({ type: CONFIRM_REVOKE_ACCESS, payload: map });
      })
      .catch(error => {
        dispatch({ type: REVOKE_LOADER, payload: false });
        getErrorMessage(error)

      });
  }

}

export function getAllUsers() {

  return function (dispatch, getState) {
    dispatch({ type: actions.REVOKE_LOADER, payload: true })
    api.get(`/getAllUsers`)
      .then(response => {

        dispatch({ type: actions.GET_ALL_ACCESS_USERS, payload: response.data });
        dispatch({ type: actions.REVOKE_LOADER, payload: false })
      })
      .catch(error => {
        dispatch({ type: REVOKE_LOADER, payload: false });
        getErrorMessage(error)
      });
  }

}



export function failure(msg) {
  toast.error(msg);
}

export function warn(msg){
  toast.warn(msg);
}



export const addEditActivityType = (data) => dispatch => {


  try {

    dispatch({ type: ADD_EDIT_ACTIVITY_TYPE, payload: data });
  } catch (err) {
    failure(Constants.ERROR_OCCURRED)
  }

}
export const showActivityType = (data) => dispatch => {

  try {

    dispatch({ type: SHOW_ACTIVITY_TYPE, payload: data });
  } catch (error) {
    failure(Constants.ERROR_OCCURRED)
  }
}

export const showViewHistory = () => dispatch => {
  try {
    dispatch({ type: TOGLLE_VIEW_HISTORY_ACTIVITY_TYPE_MODAL });
  } catch (error) {
    failure(Constants.ERROR_OCCURRED)
  }

}

/* MSJVA 732 */
export const showCategoryTypeHistory = () => dispatch => {
  try {
    dispatch({ type: TOGLLE_VIEW_HISTORY_CHANGE_TYPE_MODAL });
  } catch (error) {
    failure(Constants.ERROR_OCCURRED)
  }
}

export const completedActivityType = (data) => dispatch => {


  try {

    dispatch({ type: COMPLETED_EDIT_ACTIVITY_TYPE, payload: data });
  } catch (error) {
    failure(Constants.ERROR_OCCURRED)
  }

}

export function postEditActivityType(data) {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });

    api.put(`/editActivityType`, data)
      .then(response => {

        if (response.data && response.data.code === 201 || response.data && response.data.code === 200) {
          success(Constants.ACTIVITY_TYPE_SAVED_SUCCESSFULLY);
          dispatch({ type: LOADER, payload: false });
          dispatch({ type: COMPLETED_EDIT_ACTIVITY_TYPE, payload: true });
        } else {
          failure(response.data.message)
          dispatch({ type: LOADER, payload: false });
        }

      })
      .catch(error => {

        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });


  }
}



export function getAllActivityCategory() {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.get(`/getAllActivityCategory`)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        dispatch({ type: GET_ALL_ACTIVITY_CATEGORY_VALUES, payload: response.data });
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}

export function getAllActivityType() {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.get(`/getAllActivityType`)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        dispatch({ type: GET_ALL_ACTIVITY_TYPE_VALUES, payload: response.data });
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}
export function getAllChangeType() {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.get(`/changetype/all`)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        dispatch({ type: GET_ALL_CHANGE_TYPE_VALUES, payload: response.data });
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}
export function getAdminValues() {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.get(`/ucmmetadata?activityCategory=Y&activityType=Y&riskLevel=Y`)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        dispatch({ type: SET_ADMIN_VALUES, payload: response.data });
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}

export function saveActivityCategory(request) {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.post(`/addActivityCategory`, request)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        if (response.data && response.data.code === 201 || response.data && response.data.code === 200) {
          dispatch({ type: SAVE_ACTIVITY_CATEGORY, payload: response.data });
          success(Constants.ACTIVITY_CATEGORY_SAVED_SUCCESSFULLY);
        } else {
          dispatch({ type: SAVE_ACTIVITY_CATEGORY, payload: response.data });
          failure(response.data.message)
        }
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}
/* MSJVA 740 */
export function viewHistoryOfActivityType(activityTypeArray) {

  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.post(`/viewHistoryOfActivityType`, activityTypeArray)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        dispatch({ type: VIEW_ACTIVITY_TYPE_LOG, payload: response.data })
        dispatch({ type: ACTIVITY_TYPE_HISTORY_AVAILABLE, payload: true })
        dispatch({ type: TOGLLE_VIEW_HISTORY_ACTIVITY_TYPE_MODAL })
        console.log(response.data);
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        dispatch({ type: ACTIVITY_TYPE_HISTORY_AVAILABLE, payload: false })
        getErrorMessage(error)
      });
  }
}

/* MSJVA 732 */

export function viewHistoryOfChangeType(changeTypeObj) {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.post(`/viewHistoryOfChangeType`, changeTypeObj)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        dispatch({ type: VIEW_CHANGE_TYPE_LOG, payload: response.data })
        dispatch({ type: CHANGE_TYPE_HISTORY_AVAILABLE, payload: true })
        dispatch({ type: TOGLLE_VIEW_HISTORY_CHANGE_TYPE_MODAL })

        console.log('changeTypeHistoryLog', response.data, getState());
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        dispatch({ type: CHANGE_TYPE_HISTORY_AVAILABLE, payload: false })
        getErrorMessage(error)
      });
  }
}
export function editActivityCategory(key, request) {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.put(`/activitycategory/` + key, request)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        if (response.data && response.data.code === 201 || response.data && response.data.code === 200) {
          dispatch({ type: SAVE_ACTIVITY_CATEGORY, payload: response.data });
          success(Constants.ACTIVITY_CATEGORY_SAVED_SUCCESSFULLY);
        } else {
          dispatch({ type: SAVE_ACTIVITY_CATEGORY, payload: response.data });
          failure(response.data.message)
        }
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}

export function saveActivityType(request) {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.post(`/addActivityType`, request)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        if (response.data && response.data.code === 201 || response.data && response.data.code === 200) {
          dispatch({ type: SAVE_ACTIVITY_TYPE, payload: response.data });
          success(Constants.ACTIVITY_TYPE_SAVED_SUCCESSFULLY);
        } else {
          dispatch({ type: SAVE_ACTIVITY_TYPE, payload: null });
          failure(response.data.message)
        }
      }).then(response => {
        getAdminValues();
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}

export function saveChangeType(request) {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.post(`/changetype/`, request)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        if (response.data && response.data.code === 201 || response.data && response.data.code === 200) {
          dispatch({ type: SAVE_CHANGE_TYPE, payload: response.data });
          success(Constants.CHANGE_TYPE_SAVED_SUCCESSFULLY);
        } else {
          dispatch({ type: SAVE_CHANGE_TYPE, payload: response.data });
          failure(response.data.message)
        }
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}
export function editChangeType(key, request) {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.put(`/changetype/` + key, request)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        if (response.data && response.data.code === 201 || response.data && response.data.code === 200) {
          dispatch({ type: SAVE_CHANGE_TYPE, payload: response.data });
          success(Constants.CHANGE_TYPE_SAVED_SUCCESSFULLY);
        } else {
          dispatch({ type: SAVE_CHANGE_TYPE, payload: response.data });
          failure(response.data.message)
        }
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}

export function formErrors(errors, id) {
  return function (dispatch) {
    dispatch({ type: FORM_ERROR, payload: errors, id: id });
  }
}
export function setSelectedChangeType(obj) {
  return function (dispatch, getState) {
    dispatch({ type: SET_CHANGE_TYPE, payload: obj });
  }
}
export function resetSelectedChangeType(value) {
  return function (dispatch) {
    dispatch({ type: RESET_SELECTED_CHANGE_TYPE, payload: value });
  }
}
export function clearSaveChangeType() {
  return function (dispatch) {
    dispatch({ type: CLEAR_SAVE_CHANGE_TYPE, payload: '' });
  }
}
export function clearSaveActivityType() {
  return function (dispatch) {
    dispatch({ type: CLEAR_SAVE_ACTIVITY_TYPE, payload: '' });
  }
}

export function clearSaveActivityCategory() {
  return function (dispatch) {
    dispatch({ type: CLEAR_SAVE_ACTIVITY_CATEGORY, payload: '' });
  }
}

export function clearSaveNetworkSubNetwork() {
  return function (dispatch) {
    dispatch({ type: CLEAR_SAVE_NETWORK_SUBNETWORK, payload: '' });
  }
}

export function setSelectedActivityCatgory(selected) {
  return function (dispatch) {
    dispatch({ type: SET_SELECTED_ACTIVITY_CATEGORY, payload: selected });
  }
}

export function resetSelectedActivityCatgory(value) {
  return function (dispatch) {
    dispatch({ type: RESET_SELECTED_ACTIVITY_CATEGORY, payload: value });
  }
}

export function getErrorMessage(error) {
  let status = error.response ? (error.response.status ? error.response.status : '') : ''
  if (status !== 401) {
    failure(Constants.ERROR_OCCURRED)
  }
}

/*ASP Related Functions */
export function getAllApplicationServiceProvider() {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.get(`/serviceProvider/all`)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        dispatch({ type: GET_ALL_ASP_VALUES, payload: response.data });
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}

export function setSelectedApplicationServiceProvider(selected) {
  return function (dispatch) {
    dispatch({ type: SET_SELECTED_ASP, payload: selected });
  }
}

export function resetSelectedApplicationServiceProvider(value) {
  return function (dispatch) {
    dispatch({ type: RESET_SELECTED_ASP, payload: value });
  }
}

export function clearSaveApplicationServiceProvider() {
  return function (dispatch) {
    dispatch({ type: CLEAR_SAVE_ASP, payload: '' });
  }
}

export function saveApplicationServiceProvider(request) {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.post(`/serviceProvider/save`, request)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        if (response.data && response.data.code === 201 || response.data && response.data.code === 200) {
          dispatch({ type: SAVE_ASP, payload: response.data });
          success(Constants.ASP_SAVED_SUCCESSFULLY);
        } else {
          dispatch({ type: SAVE_ASP, payload: response.data });
          failure(response.data.message)
        }
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}

export function editASP(request) {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.post(`/serviceProvider/edit`, request)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        if (response.data && response.data.code === 201 || response.data && response.data.code === 200) {
          dispatch({ type: SAVE_ASP, payload: response.data });
          success(Constants.ASP_SAVED_SUCCESSFULLY);
        } else {
          dispatch({ type: SAVE_ASP, payload: response.data });
          failure(response.data.message)
        }
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}

export function getServiceProviderList() {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.get(`/serviceProviderTypes/all`)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        dispatch({ type: SERVICE_PROVIDER, payload: response.data });
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}

/*Contact Role related functions */
export function getAllContactRoles() {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.get(`/getContactsRole`)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        dispatch({ type: GET_ALL_CONTACT_ROLES, payload: response.data });
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}

export function setSelectedContactRole(selected) {
  return function (dispatch) {
    dispatch({ type: SET_SELECTED_CONTACT_ROLE, payload: selected });
  }
}

export function resetSelectedContactRole(value) {
  return function (dispatch) {
    dispatch({ type: RESET_SELECTED_CONTACT_ROLE, payload: value });
  }
}

export function clearSaveContactRole() {
  return function (dispatch) {
    dispatch({ type: CLEAR_SAVE_CONTACT_ROLE, payload: '' });
  }
}

export function saveContactRole(request) {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.post(`/addContactsRole`, request)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        if (response.data && response.data.code === 201 || response.data && response.data.code === 200) {
          dispatch({ type: SAVE_CONTACT_ROLE, payload: response.data });
          success(Constants.CONTACT_ROLE_SAVED_SUCCESSFULLY);
        } else {
          dispatch({ type: SAVE_CONTACT_ROLE, payload: response.data });
          failure(response.data.message)
        }
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}

export function editContactRole(request) {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.put(`/updateContactsRole`, request)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        if (response.data && response.data.code === 201 || response.data && response.data.code === 200) {
          dispatch({ type: SAVE_CONTACT_ROLE, payload: response.data });
          success(Constants.CONTACT_ROLE_SAVED_SUCCESSFULLY);
        } else {
          dispatch({ type: SAVE_CONTACT_ROLE, payload: response.data });
          failure(response.data.message)
        }
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}


export function deleteRole(payload) {
   return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.put(`/deleteContactsRole`, payload)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        if (response.data.code == 200) {
          dispatch({ type: DELETE_CONTACT_ROLE, payload: response.data });
          success('Contact Role(s) deleted successfully');
        } else {
          warn(Constants.CONTACT_ROLE_NOT_DELETED);
        }
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        failure(Constants.CONTACT_ROLE_NOT_DELETED);
      });
  }
}

export function expireRole(request) {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.put(`/expireContactsRole`, request)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        if (response.data && response.data.code === 201 || response.data && response.data.code === 200) {
          dispatch({ type: EXPIRE_CONTACT_ROLE, payload: response.data });
          success(Constants.CONTACT_ROLE_EXPIRED_SUCCESSFULLY);
        } else {
          dispatch({ type: EXPIRE_CONTACT_ROLE, payload: response.data });
          failure(response.data.message)
        }
      })
      .catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}

/* Network Sub-Network */
export function getAllNetworksSubNetworks() {
  return function (dispatch, getState) {
      dispatch({ type: LOADER, payload: true });
      api.get(`/getAllNetworksSubNetworks` )
          .then(response => {
              dispatch({ type: LOADER, payload: false });
              if(response.data && Array.isArray(response.data)){
                  dispatch({ type: GET_ALL_NETWORKS_SUBNETWORKS, payload:response.data });
              }else{
                  if(!response){
                      dispatch({ type: GET_ALL_NETWORKS_SUBNETWORKS, payload: [] });
                      failure(response.message?response.message:Constants.NETWORKS_SUBNETWORKS_API_FAILED)
                  }
              }
          }).catch(error => {
              dispatch({ type: LOADER, payload: false });
              console.log(error.message);
        });
     }
}

export function saveNetworkSubNetwork(request, successCallback) {
  return function (dispatch, getState) {
    dispatch({ type: LOADER, payload: true });
    api.post(`/addSubNetwork`, request)
      .then(response => {
        dispatch({ type: LOADER, payload: false });
        if (response.data && (response.data.code === 201 || response.data.code === 200)) {
          dispatch({ type: SAVE_SUB_NETWORK, payload: response.data });
          success(Constants.SUBNETWORK_SAVED_SUCCESSFULLY);
          successCallback();
          dispatch(getAllSubNetworkAssociations())
        } else {
          failure(response.data.message)
        }
      }).catch(error => {
        dispatch({ type: LOADER, payload: false });
        getErrorMessage(error)
      });
  }
}

export function getAllSubNetworkAssociations() {
  return function (dispatch, getState) {
      dispatch({ type: LOADER, payload: true });
      api.get(`/getSubNetwork` )
          .then(response => {
              dispatch({ type: LOADER, payload: false });
              console.log(response.data, 'Response');
              if(response.data && Array.isArray(response.data)){
                  dispatch({ type: GET_ALL_SUBNETWORK_ASSOCIATIONS, payload:response.data});
              }else{
                  if(!response){
                      dispatch({ type: GET_ALL_SUBNETWORK_ASSOCIATIONS, payload: [] });
                      failure(response.message?response.message:Constants.NETWORKS_SUBNETWORKS_API_FAILED)
                  }
              }
          }).catch(error => {
              dispatch({ type: LOADER, payload: false });
              console.log(error.message);
        });
     }
}
