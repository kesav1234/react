import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    ApprovalGroupUtilities,
    ApprovalGroupAssociation
} from './approval-group-utilities';
import { ApprovalGroupModal, Networks } from './approval-group-modal';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';
import Loader from '../../../app/atoms/Loader';
import CustomTable from '../../../app/molecules/CustomTable/CustomTable';
import AddImg from '../../../app/layout/assets/add.svg';
import CloseImg from '../../../app/layout/assets/remove-item.svg';
import sortDec from '../../../app/layout/assets/sort.svg';
import sortAsc from '../../../app/layout/assets/sort-up.svg';
import FilterImg from '../../../app/layout/assets/filter.svg';

/**
 * @typedef {Object} State
 * @property {ApprovalGroupAssociation[]} associations
 * @property {Networks} networks
 * @property {{[vzId:string]:string}} users
 * @property {*[]} tableRows
 * @property {Set<number>} selectedAssociations
 * @property {boolean} showModal
 * @property {{[column:string]:boolean}} sort
 * @property {boolean} loading
 */

class ApprovalGroup extends Component {

    constructor(props) {
        super(props);
        /** @type {State} */
        this.state = {
            associations: [],
            networks: {},
            users: {},
            selectedAssociations: new Set(),
            loading: false,
            showModal: false,
            sort: {}
        };
    }

    async componentDidMount() {

        this.setState({ loading: true });

        const { access } = this.props;
        const { user } = access;
        const { name, displayName } = user;
        const users = {};
        users[name] = displayName;
        this.setState({ users });

        Promise.all([ApprovalGroupUtilities.getAssociations(), this.saveNetworks()])
            .then(res => {
                const [unfilteredAssociations] = res;
                this.saveAssociations(unfilteredAssociations);
                const { associations } = this.state;
                const vzIds = associations.map(a => a.createdBy);
                this.saveUsers(vzIds);
            }).catch(error => {
                if (!(error.response && error.response.status === 401)) {
                    toast.error('There was an issue');
                }
            }).finally(() => { this.setState({ loading: false }); });
    }

    /**
     * Save associations. Filter out the ones with inactive networks.
     * @param {ApprovalGroupAssociation[]} associations
     */
    async saveAssociations(associations) {
        const { networks } = this.state;
        const ret = associations.filter(a => {
            const network = networks[a.networkId];
            if (!network) { return false; }
            const subNetwork = network.subNetworks[a.subNetworkId];
            if (!subNetwork) { return false; }
            return true;
        });
        this.setState({ associations: ret });
    }

    /**
     * @param {string[]} vzIds
     */
    async saveUsers(vzIds) {
        const { users } = this.state;
        const vzIdsSet = new Set();
        for (const vzId of vzIds) {
            if (!users[vzId]) { vzIdsSet.add(vzId); }
        }
        const saveUser = vzId => usr => {
            const users2 = this.state.users;
            users2[vzId] = usr.displayName;
            this.setState({ users: users2 });
        };
        for (const vzId of Array.from(vzIdsSet)) {
            await ApprovalGroupUtilities
                .getUser(vzId)
                .then(saveUser(vzId))
                .catch(e => e);
        }
    }

    async saveNetworks() {
        const networks = await ApprovalGroupUtilities.getNetworks();
        const networksMap = {};
        const now = moment();
        for (const network of networks) {
            const subNetworksMap = {};
            for (const subNetwork of network.subNetwork) {
                const snStartDate = moment(subNetwork.startDate);
                const snEndDate = moment(subNetwork.endDate);
                if (now.isBetween(snStartDate, snEndDate, undefined, '[)')) {
                    subNetworksMap[subNetwork.id] = subNetwork.name;
                }
            }
            const nStartDate = moment(network.startDate);
            const nEndDate = moment(network.endDate);
            if (now.isBetween(nStartDate, nEndDate, undefined, '[)')) {
                networksMap[network.id] = { name: network.name, subNetworks: subNetworksMap };
            }
        }
        this.setState({ networks: networksMap });
    }

    handleSelectAllCheckboxClick = event => {
        const { associations, selectedAssociations } = this.state;
        if (event.target.checked) {
            for (const association of associations) { selectedAssociations.add(association.key); }
        } else { selectedAssociations.clear(); }
        this.setState({ selectedAssociations });
    };

    getTableColumns() {
        const className = 'activity-grid-columns';
        const headerClassName = className;
        const { selectedAssociations, associations, sort } = this.state;
        const isChecked = selectedAssociations.size > 0 && selectedAssociations.size === associations.length;
        return [
            {
                accessor: 'selection',
                Header: () => (
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input " id={`checkBox`}
                            checked={isChecked}
                            onChange={this.handleSelectAllCheckboxClick}
                        />
                        <span className="spanCheck custom-control-label"></span>
                        <label className="custom-control-label margin" htmlFor={`checkBox`}></label>
                    </div>
                ),
                filterable: false,
                sortable: false,
                width: 50
            },
            {
                accessor: 'network',
                Header: () => (
                    <span>Network/Sub-Network<img src={sort.network ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>
                ),
                Filter: ({ filter, onChange }) => (
                    <div>
                        <input onChange={event => { onChange(event.target.value) }} value={filter ? filter.value : ''} />
                        <img className='filter-icon' src={FilterImg} alt='filter' />
                    </div>
                ),
                className,
                headerClassName
            },
            {
                accessor: 'adomGroup',
                Header: () => (
                    <span>ADOM Group<img src={sort.adomGroup ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>
                ),
                Filter: ({ filter, onChange }) => (
                    <div>
                        <input onChange={event => { onChange(event.target.value) }} value={filter ? filter.value : ''} />
                        <img className='filter-icon' src={FilterImg} alt='filter' />
                    </div>
                ),
                className,
                headerClassName
            },
            {
                accessor: 'createdDate',
                Header: () => (
                    <span>Created Date/Time<img src={sort.createdDate ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>
                ),
                Filter: ({ filter, onChange }) => (
                    <div>
                        <input onChange={event => { onChange(event.target.value) }} value={filter ? filter.value : ''} />
                        <img className='filter-icon' src={FilterImg} alt='filter' />
                    </div>
                ),
                className,
                headerClassName
            },
            {
                accessor: 'createdBy',
                Header: () => (
                    <span>Created By<img src={sort.createdBy ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>
                ),
                Filter: ({ filter, onChange }) => (
                    <div>
                        <input onChange={event => { onChange(event.target.value) }} value={filter ? filter.value : ''} />
                        <img className='filter-icon' src={FilterImg} alt='filter' />
                    </div>
                ),
                className,
                headerClassName
            }
        ];
    }

    handleCheckboxClick = event => {
        const associationKey = Number(event.target.value);
        const { selectedAssociations } = this.state;
        if (event.target.checked) {
            selectedAssociations.add(associationKey);
        } else {
            selectedAssociations.delete(associationKey);
        }
        this.setState({ selectedAssociations });
    };

    getTableRows() {

        const { associations, networks, users, selectedAssociations } = this.state;

        return associations.map(association => {

            const { networkId, subNetworkId, adomGroupName, key } = association;

            let network = networks[networkId];
            const subNetworkName = network.subNetworks[subNetworkId];
            network = `${network.name}/${subNetworkName}`;

            let createdBy = users[association.createdBy];
            if (!createdBy) { createdBy = association.createdBy; }

            const checked = selectedAssociations.has(key);

            return {
                network, createdBy,
                selection: (
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input " id={`checkBox-${key}`}
                            value={key}
                            checked={checked}
                            onChange={this.handleCheckboxClick}
                        />
                        <span className="spanCheck custom-control-label"></span>
                        <label className="custom-control-label margin" htmlFor={`checkBox-${key}`}></label>
                    </div>
                ),
                adomGroup: adomGroupName,
                createdDate: moment(association.createdTimestamp).format('HH:mmzz DD MMM YYYY')
            };
        });
    }

    toggleModal = async () => {
        try {
            const { showModal, networks } = this.state;
            if (!showModal) {
                const promises = [];
                if (Object.keys(networks).length < 1) {
                    promises.push(this.saveNetworks().catch(error => {
                        error.toastError = 'There was an issue getting networks';
                        throw error;
                    }));
                }
                this.setState({ loading: true });
                await Promise.all(promises);
                this.setState({ loading: false });
            }
            this.setState({ showModal: !showModal });
        } catch (error) {
            this.setState({ loading: false });
            if (!(error.response && error.response.status === 401)) {
                const { toastError } = error;
                toast.error(toastError ? toastError : 'There was an issue');
            }
        }
    }

    /**
     * @param {ApprovalGroupAssociation[]} associations
     */
    handleOnAdd = associations => {
        const a = this.state.associations;
        this.setState({ associations: a.concat(associations), showModal: false });
        toast.success('Saved Successfully');
    }

    handleDelete = async () => {
        try {
            const { selectedAssociations, associations } = this.state;
            const payload = Array.from(selectedAssociations);
            this.setState({ loading: true });
            const { keys } = await ApprovalGroupUtilities.deleteAssociations(payload);
            this.setState({ loading: false });
            const keySet = new Set(keys);
            selectedAssociations.clear();
            this.setState({
                associations: associations.filter(association => !keySet.has(association.key)),
                selectedAssociations
            });
            toast.success('Removed Successfully');
        } catch (error) {
            this.setState({ loading: false });
            toast.error('There was an issue removing the associations');
        }
    }

    handleSort = (column, val) => {
        const { sort } = this.state;
        sort[column] = !val;
        this.setState({ sort });
    }

    render() {
        const { loading, selectedAssociations, networks, associations, showModal } = this.state;
        const tableColumns = this.getTableColumns();
        const tableRows = this.getTableRows();
        const isDeleteDisabled = selectedAssociations.size <= 0;
        const isAddDisabled = selectedAssociations.size > 0;
        return (
            <div className="row">
                {loading ? <Loader /> : ''}
                {showModal ? <ApprovalGroupModal
                    networks={networks}
                    associations={associations}
                    show={true}
                    onClose={this.toggleModal}
                    onAdd={this.handleOnAdd}
                /> : ''}
                <div className="col-md-12">
                    <div className="mt2 container-fluid ucm-body bg-color admin-panel-activityType">
                        <div className='row'>
                            <div className='col-md-12'>
                                <h2 className='mt10 bold'>Approval Group Management</h2>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='float-right'>
                                    <h3 className={`float-left ml25 ${isAddDisabled ? 'icon-disable' : 'pointer'}`} onClick={isAddDisabled ? null : this.toggleModal}>
                                        <img src={AddImg} className='icon icon-disable' style={{ height: 20 }} alt='Add' /> Add
                                    </h3>
                                    <h3 className={`float-left ml25 ${isDeleteDisabled ? 'icon-disable' : 'pointer'}`} onClick={isDeleteDisabled ? null : this.handleDelete}>
                                        <img src={CloseImg} className='icon' style={{ height: 20 }} alt='Delete' /> Remove
                                    </h3>
                                </div>
                            </div>
                            <div className='col-md-12'>
                                <CustomTable tableColumns={tableColumns} tableData={tableRows} sortingMethod={this.handleSort} />
                            </div>
                        </div >
                    </div >
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { access } = state;
    return { access };
};

const _ApprovalGroup = connect(mapStateToProps)(ApprovalGroup);
export { _ApprovalGroup as ApprovalGroup, ApprovalGroup as ApprovalGroupTest };
