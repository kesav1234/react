import api from '../../../api';
import axios from 'axios';
import config from '../../../config';

export class ApprovalGroupUtilities {

    /**
     * @returns {Promise<string[]>}
     */
    static async getRecentAdomGroups() {
        return api.get('adomGroup/recent/5').then(r => r.data);
    }

    /**
     * @param {string} search
     * @returns {Promise<string[]>}
     */
    static async searchAdomGroups(search) {
        const url = `${config.ldapUrl}/userdetails/fetchAllGroups?groupName=${search}`;
        const { groupsList } = await axios.get(url).then(r => r.data);
        return groupsList.map(g => g.Group);
    }

    /**
     * @returns {Promise<ApprovalGroupAssociation[]>}
     */
    static async getAssociations() {
        return api.get('approvalGroupAssociation').then(r => {
            if (!Array.isArray(r.data)) { return []; }
            return r.data;
        });
    }

    /**
     * @param {ApprovalGroupAssociationPayload[]} associations
     * @returns {Promise<{keys:number[]}>}
     */
    static async addAssociations(associations) {
        return api.post('approvalGroupAssociation', associations).then(r => r.data);
    }

    /**
     * @param {number[]} associations The keys of the associations to delete.
     * @returns {Promise<{keys:number[]}>}
     */
    static async deleteAssociations(associations) {
        return api.put('approvalGroupAssociation/remove', associations).then(r => r.data);
    }

    /**
     * @returns {Promise<Network[]>}
     */
    static async getNetworks() {
        return api.get('getAllNetworksSubNetworks').then(r => r.data);
    }

    /**
     * @param {string} vzId
     * @returns {Promise<User>}
     */
    static async getUser(vzId) {
        return api.get(`userInfo?username=${vzId}`).then(r => r.data);
    }
}

/**
 * @typedef {Object} ApprovalGroupAssociation
 * @property {number} key
 * @property {number} networkId
 * @property {number} subNetworkId
 * @property {string} adomGroupName
 * @property {number} createdTimestamp
 * @property {string} createdBy
 */

/**
 * @typedef {Object} ApprovalGroupAssociationPayload
 * @property {number} networkId
 * @property {number} subNetworkId
 * @property {string} adomGroupName
 * @property {string} createdBy
 * @property {string} modifiedBy
 */

/**
 * @typedef {Object} Network
 * @property {string} name
 * @property {number} key
 * @property {number} id
 * @property {string} startDate
 * @property {string} endDate
 * @property {SubNetwork[]} subNetwork
 */

/**
 * @typedef {Object} SubNetwork
 * @property {string} name
 * @property {number} key
 * @property {number} id
 * @property {number} networkId
 * @property {string} startDate
 * @property {string} endDate
 */

/**
 * @typedef {Object} User
 * @property {string} displayName
 */
