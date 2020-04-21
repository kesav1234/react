export class ApprovalGroupUtilities {

    /**
     * @returns {Promise<AdomGroup[]>}
     */
    static async getRecentAdomGroups() {
        return [
            'Group1',
            'Group2'
        ];
    }

    static async searchAdomGroups() {
        return [
            'Group13',
            'Group24'
        ];
    }

    /**
     * @returns {Promise<ApprovalGroupAssociation[]>}
     */
    static async getAssociations() {
        return [
            {
                key: 1,
                adomGroupName: '1',
                createdTimestamp: 1586224305454,
                networkId: 1,
                subNetworkId: 1,
                createdBy: 'IQBALAM'
            },
            {
                key: 2,
                adomGroupName: '1',
                createdTimestamp: 1586224305454,
                networkId: 1,
                subNetworkId: 2,
                createdBy: 'VZID'
            }
        ];
    }

    /**
     * @param {ApprovalGroupAssociationPayload[]} associations
     * @returns {Promise<{keys:number[]}>}
     */
    static async addAssociations(associations) {
        let i = 0;
        const keys = associations.map(() => i++);
        return { keys };
    }

    /**
     * @param {number[]} associations The keys of the associations to delete.
     * @returns {Promise<{keys:number[]}>}
     */
    static async deleteAssociations(associations) {
        const keys = associations;
        return { keys };
    }

    /**
     * @returns {Promise<Network[]>}
     */
    static async getNetworks() {
        const startDate = '1990-01-01';
        const endDate = '2999-01-01';
        return [
            {
                startDate,
                endDate,
                id: 1,
                name: 'network1',
                subNetwork: [
                    {
                        id: 1,
                        name: 'subNetwork1',
                        startDate,
                        endDate
                    },
                    {
                        id: 2,
                        name: 'subNetwork2',
                        startDate,
                        endDate
                    }
                ]
            }
        ];
    }

    /**
     * @param {string} vzId
     * @returns {Promise<User>}
     */
    static async getUser(vzId) {
        if (vzId === 'IQBALAM') {
            return {
                displayName: 'Iqbal, Ammaar'
            };
        } else {
            return {
                displayName: 'User, Fake'
            };
        }
    }
}

/**
 * @typedef {Object} AdomGroup
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} ApprovalGroupAssociation
 * @property {number} key
 * @property {number} networkKey
 * @property {number} subNetworkKey
 * @property {number} adomGroupId
 * @property {number} createdTimestamp
 * @property {string} createdBy
 */

/**
 * @typedef {Object} ApprovalGroupAssociationPayload
 * @property {number} networkKey
 * @property {number} subNetworkKey
 * @property {number} adomGroupId
 * @property {string} createdBy
 * @property {string} modifiedBy
 */

/**
 * @typedef {Object} Network
 * @property {string} name
 * @property {number} key
 * @property {SubNetwork[]} subNetwork
 */

/**
 * @typedef {Object} SubNetwork
 * @property {string} name
 * @property {number} key
 * @property {number} networkId
 */

/**
 * @typedef {Object} User
 * @property {string} displayName
 */
