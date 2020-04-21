import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../redux/actionCreators';
import CustomTable from '../../../app/molecules/CustomTable/CustomTable';
import ActivityCategoryActions from './activity-category-actions';
import Loader from '../../../app/atoms/Loader';
import moment from "moment/moment";
import sortDec from '../../../app/layout/assets/sort.svg';
import sortAsc from '../../../app/layout/assets/sort-up.svg';
import FilterImg from '../../../app/layout/assets/filter.svg';
import DownArrowImg from '../../../app/layout/assets/Dropdown-arrow.svg';
import RightArrowImg from '../../../app/layout/assets/Arrow-right-black.svg';


class ActivityCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tableColumns: [],
            itemArr: [],
            sort: {
                name: '',
                startDateFormat: '',
                endDateFormat: '',
                description: '',
                createdDateFormat: '',
                userFullName: '',
                modifiedDateFormat: '',
                modifiedBy: '',
            },
            selectedCategory: [],
            selected: []
        }
        this.renderSorting = this.renderSorting.bind(this);
        this.activityCategorySelection = this.activityCategorySelection.bind(this);
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

    activityCategorySelection(event, item) {
        var selectedCategory = [...this.state.selectedCategory];
        var selected = [...this.state.selected];
        if (event.target.checked) {
            selectedCategory.push(item);
            selected.push(item.key);
        } else {
            if (selectedCategory.length > 0) {
                var request = selectedCategory;
                var index = request.findIndex(x => x.key === item.key);
                request.splice(index, 1);
                _.remove(selected, function (n) {
                    return n === item.key;
                });
            }
        }
        this.setState({
            selectedCategory: selectedCategory,
            selected: selected
        });
    }

    componentWillMount() {
        this.props.getAllActivityCategory();
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
                    accessor: 'startDateFormat',
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
                    accessor: 'endDateFormat',
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
                    accessor: 'createdDateFormat',
                    Header: () => (<span>Created Date<img src={this.state.sort.createdDateFormat ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'userFullName',
                    Header: () => (<span>Created By<img src={this.state.sort.userFullName ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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
        const { resetSelectedActivityCategory } = this.props.adminData;
        if (prevProps.adminData.resetSelectedActivityCategory !== resetSelectedActivityCategory && resetSelectedActivityCategory) {
            this.setState({
                selectedCategory: [],
                selected: []
            }, () => {
                this.props.setSelectedActivityCatgory(this.state.selectedCategory);
                this.props.resetSelectedActivityCatgory(false);
            });
        }
    }

    renderList(list) {
        var itemArr = [];
        const { selected } = this.state;
        _.map(list, (item, index) => {
            var id = <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input " id={`checkBox-${item.key}`}
                    value={item.key} onClick={(e) => { this.activityCategorySelection(e, item) }}
                    checked={_.includes(selected, item.key) ? 'checked' : false} />
                        <span className="spanCheck custom-control-label"></span>
                <label className="custom-control-label margin" htmlFor={`checkBox-${item.key}`}></label>
            </div>
            item['selection'] = id;
            item['startDateFormat'] = moment(item.startDate).format('MM/DD/YYYY');
            item['endDateFormat'] = moment(item.endDate).format('MM/DD/YYYY');
            item['createdDateFormat'] = moment(item.createdDate).format('MM/DD/YYYY');
            item['modifiedDateFormat'] = moment(item.modifiedDate).format('MM/DD/YYYY');
            itemArr.push(item);
        });
        return (
            <div className='col-md-12'>
                <CustomTable tableColumns={this.state.tableColumns} tableData={itemArr} sortingMethod={this.renderSorting} />
            </div>
        );
    }

    render() {
        const { activeCategory, loader } = this.props.adminData;
        this.state.loading = loader;
        return (
            <div className="row">
                <div className="col-md-12">
                    {this.state.loading ? <Loader /> : ''}
                    <div className="mt2 container-fluid ucm-body bg-color admin-panel-activityType">
                        <div className='row'>
                            <div className='col-md-12'>
                                <h2 className='mt10 bold'>Activity Category</h2>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-12'>
                                <ActivityCategoryActions selectedCategory={this.state.selectedCategory} />
                            </div>
                            {this.renderList(activeCategory)}
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
export default connect(mapStateToProps, actions)(withRouter(ActivityCategory));