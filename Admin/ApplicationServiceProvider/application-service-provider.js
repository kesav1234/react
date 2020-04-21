import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../redux/actionCreators';
import CustomTable from '../../../app/molecules/CustomTable/CustomTable';
import ApplicationServiceProviderActions from './application-service-provider-actions';
import Loader from '../../../app/atoms/Loader';
import moment from "moment/moment";
import sortDec from '../../../app/layout/assets/sort.svg';
import sortAsc from '../../../app/layout/assets/sort-up.svg';
import FilterImg from '../../../app/layout/assets/filter.svg';
import DownArrowImg from '../../../app/layout/assets/Dropdown-arrow.svg';
import RightArrowImg from '../../../app/layout/assets/Arrow-right-black.svg';


class ApplicationServiceProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tableColumns: [],
            itemArr: [],
            sort: {
                name: '',
                type: '',
                startDateFormat: '',
                status: '',
                description: '',
                createdDate: '',
                modifiedBy: '',
                endDateFormat: ''
            },
            selectedASP: [],
            selected: []
        }
        this.renderSorting = this.renderSorting.bind(this);
        this.applicationServiceProviderSelection = this.applicationServiceProviderSelection.bind(this);
        this.checkAll = this.checkAll.bind(this);
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

    applicationServiceProviderSelection(event, item) {
        var selectedASP = [...this.state.selectedASP];
        var selected = [...this.state.selected];
        if (event.target.checked) {
            selectedASP.push(item);
            selected.push(item.key);
        } else {
            if (selectedASP.length > 0) {
                var request = selectedASP;
                var index = request.findIndex(x => x.key === item.key);
                request.splice(index, 1);
                _.remove(selected, function (n) {
                    return n === item.key;
                });
            }
        }
        this.setState({
            selectedASP: selectedASP,
            selected: selected
        });
    }

    componentWillMount() {
        this.props.getAllApplicationServiceProvider();
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
                    Header: () => (<span>Start Date<img src={this.state.sort.startDateFormat ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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
                    Header: () => (<span>End Date<img src={this.state.sort.endDateFormat ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'type',
                    Header: () => (<span>Service Provider Type<img src={this.state.sort.createdDateFormat ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'modifiedDate',
                    Header: () => (<span>Last Modified Date<img src={this.state.sort.modifiedDateFormat ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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
        const { resetSelectedASP } = this.props.adminData;
        if (prevProps.adminData.resetSelectedASP !== resetSelectedASP && resetSelectedASP) {
            this.setState({
                selectedASP: [],
                selected: []
            }, () => {
                this.props.setSelectedApplicationServiceProvider(this.state.selectedASP);
                this.props.resetSelectedApplicationServiceProvider(false);
            });
        }
    }

    renderList(list) {
        var itemArr = [];
        const { selected } = this.state;
        _.map(list, (item, index) => {
            var id = <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input " id={`checkBox-${item.key}`}
                    value={item.key} onClick={(e) => { this.applicationServiceProviderSelection(e, item) } }
                    checked={_.includes(selected, item.key) ? 'checked' : false} />
                <span className="spanCheck custom-control-label"></span>
                <label className="custom-control-label margin" htmlFor={`checkBox-${item.key}`}></label>
            </div>
            let current=moment().utc(); 
            item['status'] =moment(current).isBetween(item.startDate, item.endDate,null,'[]')?'Active':'In Active'
            item['selection'] = id;
            item['startDate'] = moment(item.startDate).format('MM/DD/YYYY');
            item['endDate'] = moment(item.endDate).format('MM/DD/YYYY');
            item['createdDate'] = moment(item.createdDate).format('MM/DD/YYYY');
            item['modifiedDate'] = moment(item.modifiedDate).format('MM/DD/YYYY');
            item['type'] = item.serviceProviderType ? item.serviceProviderType.name : '';
            item['description'] = item.desc;
            itemArr.push(item);
        });
        return (
            <div className='col-md-12'>
                <CustomTable tableColumns={this.state.tableColumns} tableData={itemArr} sortingMethod={this.renderSorting} />
            </div>
        );
    }

    render() {
        const { asp, loader } = this.props.adminData;
        this.state.loading = loader;
        return (
            <div className="row">
                <div className="col-md-12">
                    {this.state.loading ? <Loader /> : ''}
                    <div className="mt2 container-fluid ucm-body bg-color admin-panel-activityType">
                        <div className='row'>
                            <div className='col-md-12'>
                                <h2 className='mt10 bold'>Service Provider</h2>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-12'>
                                <ApplicationServiceProviderActions selectedASP={this.state.selectedASP} />
                            </div>
                            {this.renderList(asp)}
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
export default connect(mapStateToProps, actions)(withRouter(ApplicationServiceProvider));