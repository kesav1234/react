import * as actions from './actions/index'
import update from 'immutability-helper';
import _ from 'lodash';

const initialState = {
    loader: false,
    revokeLoader:false,
    masterDataValues: {},
    activeCategory: '',
    activityType: '',
    changeType:'',
    formError: {},
    selectedChangeType:[],
    resetSelectedChangeType:false,
    saveChangeType:'',
    saveActivityCategory: '',
    saveActivityType: '',
    addEditActivityData:{},
    showEditActivityType:false,
    completedActivityType:false,
    confirmRevoke:{},
    allUsers:[],
    selectedActivityCategory: [],
    resetSelectedActivityCategory: false,
    /* MSJVA 740 */
    activityTypeHistoryLog:[],
    activityTypeHistortAvailable:false,
    toggleViewHistoryActivityTypeModal:false,
    /* MSJA 732 */
    changeTypeHistoryLog:[],
    changeTypeHistoryAvailable:false,
    toggleViewHistoryChangeTypeModal:false,
    /*ASP Related Fields*/
    resetSelectedASP: false,
    selectedASP: [],
    asp: '',
    saveASP: '',
    serviceProvider: '',
    /*Contact Role related fields */
    contactRoles: '',
    resetSelectedContactRole: false,
    selectedContactRole: [],
    saveContactRole: '',
    deleteContactRole: '',
    expireContactRole: '',
    /* Network-SubNetwork*/
    networkSubNetwork: ''
};

let initializeState = _.cloneDeep(initialState);

export function adminDataState(state = { ...initializeState }, action) {
    switch (action.type) {
        case actions.REVOKE_LOADER:
            return update(state, { $merge: { revokeLoader: action.payload } });
        case actions.LOADER:
            return update(state, { $merge: { loader: action.payload } });
        case actions.ADD_EDIT_ACTIVITY_TYPE:
            return update(state, { $merge: { addEditActivityData: action.payload } });

        case actions.COMPLETED_EDIT_ACTIVITY_TYPE:

            return update(state, { $merge: { completedActivityType: action.payload } });

        case actions.SHOW_ACTIVITY_TYPE:
            return update(state, { $merge: { showEditActivityType: action.payload } });
        case actions.CONFIRM_REVOKE_ACCESS:
            return update(state, { $merge: { confirmRevoke: action.payload } });
        case actions.GET_ALL_ACCESS_USERS:
            return update(state, { $merge: { allUsers: action.payload } });

        case actions.SET_ADMIN_VALUES:
            return update(state, { $merge: { masterDataValues: action.payload } });
        case actions.GET_ALL_ACTIVITY_CATEGORY_VALUES:
            return update(state, { $merge: { activeCategory: action.payload } });
        case actions.GET_ALL_ACTIVITY_TYPE_VALUES:
            return update(state, { $merge: { activityType: action.payload } });
        case actions.GET_ALL_CHANGE_TYPE_VALUES:
            return update(state, { $merge: { changeType: action.payload } });
        case actions.SET_CHANGE_TYPE:
            return { ...state, selectedChangeType: action.payload };
        case actions.RESET_SELECTED_CHANGE_TYPE:
            return update(state, { $merge: { resetSelectedChangeType: action.payload } });

        case actions.FORM_ERROR:
            if (action.key) {
                return update(state, { formError: { $unset: [action.key] } });
            } else {
                return update(state, { $merge: { formError: action.payload } });
            }
        case actions.SAVE_ACTIVITY_CATEGORY:
            return update(state, { $merge: { saveActivityCategory: action.payload } });
        case actions.SAVE_ACTIVITY_TYPE:
            return update(state, { $merge: { saveActivityType: action.payload } });
        case actions.SAVE_CHANGE_TYPE:
            return update(state, { $merge: { saveChangeType: action.payload } });
        case actions.CLEAR_SAVE_CHANGE_TYPE:
            return update(state, { $merge: { saveChangeType: action.payload } });
        case actions.CLEAR_SAVE_ACTIVITY_TYPE:
            return update(state, { $merge: { saveActivityType: action.payload } });
        case actions.CLEAR_SAVE_ACTIVITY_CATEGORY:
            return update(state, { $merge: { saveActivityCategory: action.payload } });
        case actions.SET_SELECTED_ACTIVITY_CATEGORY:
            return update(state, { $merge: { selectedActivityCategory: action.payload } });
        case actions.RESET_SELECTED_ACTIVITY_CATEGORY:
            return update(state, { $merge: { resetSelectedActivityCategory: action.payload } });
        /* MSJVA 740 */
        case actions.VIEW_ACTIVITY_TYPE_LOG:
            return {...state,
                activityTypeHistoryLog:action.payload};
        case actions.ACTIVITY_TYPE_HISTORY_AVAILABLE:
            return {...state,
                activityTypeHistortAvailable:action.payload};
        case actions.TOGLLE_VIEW_HISTORY_ACTIVITY_TYPE_MODAL:
            return {...state,
                toggleViewHistoryActivityTypeModal:!state.toggleViewHistoryActivityTypeModal}
        /* MSJVA 732 */
        case actions.VIEW_CHANGE_TYPE_LOG:
            return {...state,
                changeTypeHistoryLog:action.payload};
        case actions.CHANGE_TYPE_HISTORY_AVAILABLE:
            return {...state,
                changeTypeHistoryAvailable:action.payload};
        case actions.TOGLLE_VIEW_HISTORY_CHANGE_TYPE_MODAL:
            return {...state,
                toggleViewHistoryChangeTypeModal:!state.toggleViewHistoryChangeTypeModal}
        /*ASP Related cases */
        case actions.RESET_SELECTED_ASP:
            return update(state, { $merge: { resetSelectedASP: action.payload } });
        case actions.SET_SELECTED_ASP:
            return update(state, { $merge: { selectedASP: action.payload } });
        case actions.GET_ALL_ASP_VALUES:
            return update(state, { $merge: { asp: action.payload } });
        case actions.CLEAR_SAVE_ASP:
            return update(state, { $merge: { saveASP: action.payload } });
        case actions.SAVE_ASP:
            return update(state, { $merge: { saveASP: action.payload } });
        case actions.SERVICE_PROVIDER:
            return update(state, { $merge: { serviceProvider: action.payload } });
        /*Contact Role Related Cases */
        case actions.GET_ALL_CONTACT_ROLES:
            return update(state, { $merge: { contactRoles: action.payload } });
        case actions.RESET_SELECTED_CONTACT_ROLE:
            return update(state, { $merge: { resetSelectedContactRole: action.payload } });
        case actions.SET_SELECTED_CONTACT_ROLE:
            return update(state, { $merge: { selectedContactRole: action.payload } });
        case actions.CLEAR_SAVE_CONTACT_ROLE:
            return update(state, { $merge: { saveContactRole: action.payload } });
        case actions.SAVE_CONTACT_ROLE:
            return update(state, { $merge: { saveContactRole: action.payload } });
        case actions.DELETE_CONTACT_ROLE:
            return update(state, { $merge: { deleteContactRole: action.payload } });
        case actions.EXPIRE_CONTACT_ROLE:
            return update(state, { $merge: { expireContactRole: action.payload } });
        /* Network Sub-Network */
        case actions.GET_ALL_NETWORKS_SUBNETWORKS:
            return update(state, { $merge: { networkSubNetwork: action.payload } });
        case actions.SAVE_SUB_NETWORK:
            return update(state, { $merge: { saveNetworkSubNetwork: action.payload } });
        case actions.GET_ALL_SUBNETWORK_ASSOCIATIONS:
            return update(state, { $merge: { subNetworkAssociations: action.payload } });
        default:
            return state;
    }
}


