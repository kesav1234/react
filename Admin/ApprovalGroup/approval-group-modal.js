import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '../../../app/molecules/Modal';
import CustomeMultiSelect from '../../../app/molecules/CustomeMultiSelect';
import CustomSelect from '../../../app/molecules/CustomSelect';
import {
    ApprovalGroupAssociation,
    ApprovalGroupAssociationPayload,
    ApprovalGroupUtilities,
    AdomGroup
} from './approval-group-utilities';
import { toast } from 'react-toastify';
import Loader from '../../../app/atoms/Loader';

/**
 * @typedef {Object} Props
 * @property {Networks} networks
 * @property {ApprovalGroupAssociation[]} associations
 * @property {boolean} show
 * @property {()=>void} onClose
 * @property {(associations:ApprovalGroupAssociation[])=>void} onAdd
 */

/**
 * @typedef {{[id:number]:string}} AdomGroups
 */

/**
 * @typedef {{[key:number]:{name:string,subNetworks:{[key:string]:string}}}} Networks
 */

/**
 * @typedef {Object} State
 * @property {string[]} recentAdomGroups
 * @property {string[]} searchedAdomGroups
 * @property {string} adomGroupSearchString
 * @property {boolean} adomGroupSearchLoading
 * @property {Selection} selectedNetwork
 * @property {Selection[]} selectedSubNetworks
 * @property {Selection[]} selectedAdomGroups
 * @property {boolean} subNetworksClear
 * @property {Validation} validation
 * @property {boolean} loading
 */

class ApprovalGroupModal extends Component {

    constructor(props) {
        super(props);
        /** @type {Props} */
        this.props;
        /** @type {State} */
        this.state = {
            recentAdomGroups: [],
            searchedAdomGroups: [],
            adomGroupSearchString: '',
            adomGroupSearchLoading: true,
            selectedNetwork: null,
            selectedSubNetworks: [],
            selectedAdomGroups: [],
            subNetworksClear: false,
            validation: {
                valid: false
            },
            loading: false
        };
    }

    async componentDidMount() {
        try {
            const groups = await ApprovalGroupUtilities.getRecentAdomGroups();
            this.setState({ recentAdomGroups: groups, adomGroupSearchLoading: false });
        } catch (error) {
            this.setState({ adomGroupSearchLoading: false });
            this.showWarning('There was an issue getting recent ADOM groups', error);
        }
    }

    /**
     * @param {string} msg
     * @param {Error} [error]
     */
    showWarning(msg, error) {
        const isUnauthorizedError = error && error.response && error.response.status === 401;
        if (!isUnauthorizedError) {
            toast.warn(msg);
        }
    }

    nameComparer = (a, b) => {
        const n1 = a.name.toUpperCase();
        const n2 = b.name.toUpperCase();
        return n1.localeCompare(n2);
    }

    getNetworks() {
        const { networks } = this.props;
        const ids = Object.keys(networks);
        const ret = [];
        for (const id of ids) {
            ret.push({
                key: id, name: networks[id].name
            });
        }
        return ret.sort(this.nameComparer);
    }

    getSubNetworks() {
        const { selectedNetwork } = this.state;
        const { networks } = this.props;
        if (!selectedNetwork) { return []; }
        const networkId = selectedNetwork.key;
        const network = networks[networkId];
        const { subNetworks } = network;
        const ids = Object.keys(subNetworks);
        const ret = [];
        for (const id of ids) {
            ret.push({
                key: id, name: subNetworks[id]
            });
        }
        return ret.sort(this.nameComparer);
    }

    getAdomGroups() {
        const { recentAdomGroups, searchedAdomGroups, adomGroupSearchString, adomGroupSearchLoading } = this.state;
        if (adomGroupSearchLoading) { return []; }
        const adomGroups = adomGroupSearchString === '' ? recentAdomGroups : searchedAdomGroups;
        return adomGroups.map(g => ({ name: g, key: g }));
    }

    /**
     * @param {Selection} selectedNetwork
     * @param {Selection[]} selectedSubNetworks
     * @param {Selection[]} selectedAdomGroups
     * @returns {Validation}
     */
    getValidation(selectedNetwork, selectedSubNetworks, selectedAdomGroups) {
        const { associations, networks } = this.props;
        if (!selectedNetwork) { return { valid: false }; }
        if (selectedSubNetworks.length < 1) { return { valid: false }; }
        if (selectedAdomGroups.length < 1) { return { valid: false }; }
        const selectedSubNetworksKeys = new Set(selectedSubNetworks.map(n => n.key));
        const selectedAdomGroupsNames = new Set(selectedAdomGroups.map(g => g.key));
        for (const association of associations) {
            const { networkId, subNetworkId, adomGroupName } = association;
            if (
                `${networkId}` === `${selectedNetwork.key}` &&
                selectedSubNetworksKeys.has(`${subNetworkId}`) &&
                selectedAdomGroupsNames.has(`${adomGroupName}`)
            ) {
                let network = networks[networkId];
                const subNetwork = network.subNetworks[subNetworkId];
                network = network.name;
                return { valid: false, error: <p><span style={{ color: 'red' }}>The association already exists:</span> {network}/{subNetwork} - {adomGroupName}</p> };
            }
        }
        return { valid: true };
    }

    handleNetworkSelect = (k, selectedNetwork) => {
        const { selectedAdomGroups } = this.state;
        const selectedSubNetworks = [];
        const validation = this.getValidation(selectedNetwork, selectedSubNetworks, selectedAdomGroups);
        this.setState({
            selectedNetwork,
            selectedSubNetworks,
            validation,
            subNetworksClear: true
        });
    }

    handleSubNetworkSelect = selectedSubNetworks => {
        const { selectedNetwork, selectedAdomGroups } = this.state;
        const validation = this.getValidation(selectedNetwork, selectedSubNetworks, selectedAdomGroups);
        this.setState({
            selectedSubNetworks,
            subNetworksClear: false,
            validation
        });
    }

    handleAdomGroupSelect = selectedAdomGroups => {
        const { selectedNetwork, selectedSubNetworks } = this.state;
        const validation = this.getValidation(selectedNetwork, selectedSubNetworks, selectedAdomGroups);
        this.setState({
            selectedAdomGroups,
            validation
        });
    }

    handleOnSave = async () => {
        try {
            const { selectedNetwork, selectedSubNetworks, selectedAdomGroups } = this.state;
            const { access, onAdd } = this.props;
            const { user } = access;
            const { name } = user;
            /** @type {ApprovalGroupAssociationPayload[]} */
            const payload = [];
            for (const subNetwork of selectedSubNetworks) {
                for (const group of selectedAdomGroups) {
                    payload.push({
                        networkId: selectedNetwork.key,
                        subNetworkId: subNetwork.key,
                        adomGroupName: group.key,
                        createdBy: name,
                        modifiedBy: name
                    });
                }
            }
            this.setState({ loading: true });
            const { keys } = await ApprovalGroupUtilities.addAssociations(payload);
            this.setState({ loading: false });
            /** @type {ApprovalGroupAssociation[]} */
            const ret = payload.map((p, i) => {
                p.key = keys[i];
                p.createdTimestamp = Date.now();
                return p;
            });
            onAdd(ret);
        } catch (error) {
            this.setState({ loading: false });
            toast.error('There was an issue adding the association(s)');
        }
    }

    /** @type {{[search:string]:string[]}} */
    adomGroupSearches = {};

    handleAdomGroupSearch = async search => {
        this.setState({ adomGroupSearchString: search });
        if (search !== '') {
            try {
                if (!this.adomGroupSearches[search]) {
                    this.setState({ adomGroupSearchLoading: true });
                    this.adomGroupSearches[search] = await ApprovalGroupUtilities.searchAdomGroups(search);
                }
                const { adomGroupSearchString } = this.state;
                const res = this.adomGroupSearches[adomGroupSearchString];
                this.setState({ searchedAdomGroups: res, adomGroupSearchLoading: false });
            } catch (error) {
                this.setState({ adomGroupSearchLoading: false });
                this.showWarning('There was an issue searching ADOM groups', error);
            }
        }
    }

    render() {
        const selectClass = 'col-md-6 form-group';
        const networks = this.getNetworks();
        const subNetworks = this.getSubNetworks();
        const adomGroups = this.getAdomGroups();
        const { selectedNetwork, subNetworksClear, validation, loading, adomGroupSearchLoading } = this.state;
        const isSubNetworksDisabled = !selectedNetwork;
        const { valid, error } = validation;
        const { show, onClose } = this.props;
        return (
            <Modal
                show={show}
                onClose={onClose}
                onSave={this.handleOnSave}
                title={'Associate Network and ADOM Group'}
                children={(
                    <div className={'row'}>
                        {loading ? <Loader /> : ''}
                        <div className={selectClass}>
                            <CustomSelect
                                name={'network'}
                                label={'Network*'}
                                options={networks}
                                onChange={this.handleNetworkSelect}
                                tabIndex="0"
                                toggleOptions={() => { return; }}
                            />
                        </div>
                        <div className={selectClass}>
                            <CustomeMultiSelect
                                name={'subNetwork'}
                                label={'Sub-Network*'}
                                options={subNetworks}
                                updateSelectedDevices={this.handleSubNetworkSelect}
                                tabIndex="1"
                                disabled={isSubNetworksDisabled}
                                clear={subNetworksClear}
                            />
                        </div>
                        <div className={selectClass}>
                            <CustomeMultiSelect
                                name={'adomGroup'}
                                label={'ADOM Group*'}
                                options={adomGroups}
                                updateSelectedDevices={this.handleAdomGroupSelect}
                                tabIndex="2"
                                disabled={false}
                                onHandleSearch={this.handleAdomGroupSearch}
                                endMessage={adomGroupSearchLoading ? <h3>Loading...</h3> : undefined}
                            />
                        </div>
                        {error ? <div className={'col-md-12'}>{error}</div> : ''}
                    </div>
                )}
                footer={true}
                saveText={'Add'}
                cancelText={'Cancel'}
                saveDisabled={!valid}
            />
        );
    }
}

const mapStateToProps = state => {
    const { access } = state;
    return { access };
};

const _ApprovalGroupModal = connect(mapStateToProps)(ApprovalGroupModal);
export { _ApprovalGroupModal as ApprovalGroupModal, ApprovalGroupModal as ApprovalGroupModalTest };

/**
 * @typedef {{valid:boolean,error?:string}} Validation
 */

/**
 * @typedef {{name:string,key:number|string}} Selection
 */
