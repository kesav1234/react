import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../redux/actionCreators';
import CustomTable from '../../../app/molecules/CustomTable/CustomTable';
import ContactRoleActions from './contact-role-actions';
import Loader from '../../../app/atoms/Loader';
import moment from "moment/moment";
import sortDec from '../../../app/layout/assets/sort.svg';
import sortAsc from '../../../app/layout/assets/sort-up.svg';
import FilterImg from '../../../app/layout/assets/filter.svg';
import DownArrowImg from '../../../app/layout/assets/Dropdown-arrow.svg';
import RightArrowImg from '../../../app/layout/assets/Arrow-right-black.svg';


class ContactRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tableColumns: [],
            itemArr: [],
            sort: {
                name: '',
                startDate: '',
                endDate: '',
                createdDateFormat: '',
                status: '',
                description: '',
                modifiedDateFormat: '',
                modifiedBy: '',
            },
            selectedContactRole: [],
            selected: []
        }
        this.renderSorting = this.renderSorting.bind(this);
        this.contactRoleSelection = this.contactRoleSelection.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.setDeleteOrExpire = this.setDeleteOrExpire.bind(this);
        this.formatDateTime = this.formatDateTime.bind(this);
    }

    renderSorting(header, val) {
        if (header) {
            this.setState(({ sort }) => (
                {
                    sort: Object.assign({}, sort, { [header]: !val })
                }
            ));
        }
    }

    checkAll(event) { }

    contactRoleSelection(event, item) {
        var selectedContactRole = [...this.state.selectedContactRole];
        var selected = [...this.state.selected];
        if (event.target.checked) {
            selectedContactRole.push(item);
            selected.push(item.contactsId);
        } else {
            if (selectedContactRole.length > 0) {
                var request = selectedContactRole;
                var index = request.findIndex(x => x.contactsId === item.contactsId);
                request.splice(index, 1);
                _.remove(selected, function (n) {
                    return n === item.contactsId;
                });
            }
        }
        this.setState({
            selectedContactRole: selectedContactRole,
            selected: selected
        });
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.delete){
               if (nextProps.adminData.deleteContactRole !== this.props.adminData.deleteContactRole) {
                   const { deleteContactRole } = nextProps.adminData;
                   if (deleteContactRole.code == 200) {
                        this.props.getAllContactRoles();
                        this.setState({
                            selectedContactRole: [],
                            selected: []
                            }, () => {
                                this.props.setSelectedContactRole(this.state.selectedContactRole);
                                this.props.resetSelectedContactRole(false);
                    });  
                    }
                }
        }
        if(this.state.expire){
            if (nextProps.adminData.expireContactRole !== this.props.adminData.expireContactRole) {
            const { expireContactRole } = nextProps.adminData;
            if (expireContactRole.code == 200) {
                this.props.getAllContactRoles();
                this.setState({
                    selectedContactRole: [],
                    selected: []
                    }, () => {
                        this.props.setSelectedContactRole(this.state.selectedContactRole);
                        this.props.resetSelectedContactRole(false);
                });
            }
        }
    }
}

    componentWillMount() {
        this.props.getAllContactRoles();
        this.renderSorting();
        this.setState({
            tableColumns: [
                {
                    accessor: 'selection', Header: () => (<div className="custom-control">

                        <label className=" margin" htmlFor="customControlValidation1"></label>
                    </div>), filterable: false, sortable: false, width: 50
                },
                {
                    accessor: 'name',
                    Header: () => (<span>Name<img src={this.state.sort.name ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'description',
                    Header: () => (<span>Description<img src={this.state.sort.description ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'status',
                    Header: () => (<span>Status<img src={this.state.sort.status ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'startDate',
                    Header: () => (<span>Start Date<img src={this.state.sort.startDate ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'endDate',
                    Header: () => (<span>End Date<img src={this.state.sort.endDate ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'createdDateFormat',
                    Header: () => (<span>Created Date/Time<img src={this.state.sort.createdDate ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'modifiedDateFormat',
                    Header: () => (<span>Last Modified Date/Time<img src={this.state.sort.modifiedDateFormat ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'modifiedBy',
                    Header: () => (<span>Last Modified By<img src={this.state.sort.modifiedBy ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                }]
        });
    }

    componentDidUpdate(prevProps) {
        const { resetSelectedContactRole } = this.props.adminData;
        if (prevProps.adminData.resetSelectedContactRole !== resetSelectedContactRole && resetSelectedContactRole) {
            this.setState({
                selectedContactRole: [],
                selected: []
            }, () => {
                this.props.setSelectedContactRole(this.state.selectedContactRole);
                this.props.resetSelectedContactRole(false);
            });
        }
    }

    setDeleteOrExpire(mode){
        if(mode==='expire')
            this.setState({expire: true, delete: false});
        else
            this.setState({delete: true, expire: false})
    }

    formatDateTime(value) {
        return value ? moment(value).format("MM/DD/YYYY") + ' - ' + moment(value).format("HH:mm") + ' GMT' : ''
      }

    renderList(list) {
        var itemArr = [];
        const { selected } = this.state;
        _.map(list, (item, index) => {
            var id = <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input " id={`checkBox-${item.contactsId}`}
                    value={item.contactsId} onClick={(e) => { this.contactRoleSelection(e, item) } }
                    checked={_.includes(selected, item.contactsId) ? 'checked' : false} />
                <span className="spanCheck custom-control-label"></span>
                <label className="custom-control-label margin" htmlFor={`checkBox-${item.contactsId}`}></label>
            </div>
            let current=moment().utc(); 
            item['status'] =moment(current).isBetween(item.startDate, item.endDate,null,'[]')?'Active':'In Active'
            item['name'] = item.roleName;
            item['selection'] = id;
            item['startDate'] = moment(item.startDate).format('MM/DD/YYYY');
            item['endDate'] = moment(item.endDate).format('MM/DD/YYYY');
            item['createdDateFormat'] =this.formatDateTime(item.createdDate);
            item['modifiedDateFormat'] = this.formatDateTime(item.modifiedDate);;
            item['description'] = item.description;
            
            
            itemArr.push(item);
        });
        return (
            <div className='col-md-12'>
                <CustomTable tableColumns={this.state.tableColumns} tableData={itemArr} sortingMethod={this.renderSorting} />
            </div>
        );
    }

    render() {
        const { contactRoles, loader } = this.props.adminData;
        this.state.loading = loader;
        return (
            <div className="row">
                <div className="col-md-12">
                    {this.state.loading ? <Loader /> : ''}
                    <div className="mt2 container-fluid ucm-body bg-color admin-panel-activityType">
                        <div className='row'>
                            <div className='col-md-12'>
                                <h2 className='mt10 bold'>Contact Roles</h2>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-12'>
                                <ContactRoleActions selectedContactRole={this.state.selectedContactRole} setDeleteOrExpire = {this.setDeleteOrExpire}/>
                            </div>
                            {this.renderList(contactRoles)}
                        </div>
                    </div>
                </div>
            </div>);
    }
}
function mapStateToProps(state) {
    var { adminData } = state;
    return { adminData };
}
export default connect(mapStateToProps, actions)(withRouter(ContactRole));