import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../redux/actionCreators';
import CustomTable from '../../../app/molecules/CustomTable/CustomTable';
import moment from "moment/moment";
import Modal from "../../../app/molecules/Modal";
import Loader from '../../../app/atoms/Loader';
import sortDec from '../../../app/layout/assets/sort.svg';
import sortAsc from '../../../app/layout/assets/sort-up.svg';
import FilterImg from '../../../app/layout/assets/filter.svg';
import DownArrowImg from '../../../app/layout/assets/Dropdown-arrow.svg';
import RightArrowImg from '../../../app/layout/assets/Arrow-right-black.svg';
import EditImg from '../../../app/layout/assets/edit.svg';
import EditGrey from '../../../app/layout/assets/Edit_grey.svg';
import AddImg from '../../../app/layout/assets/add.svg';
import CloseImg from '../../../app/layout/assets/remove-item.svg';
import SaveImg from '../../../app/layout/assets/schedule_black.svg';
import ChangeTypeActions from './change-type-actions';

class ChangeType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tableColumns: [],
            itemArr: [],
            sort: {
                name: '',
                status:'',
                startDateFormat: '',
                endDateFormat: '',
                description: '',
                createdDateFormat: '',
                userFullName: '',
                lastModifiedDate: '',
                modifiedBy: '',
                mopRequiredFormat: ''
            },
            disableActions: {
                save: true,
                edit: true,
                delete: true,
                add: false,
            },
            selected: [],
            selectedCategory: [],
           
        }
        this.renderSorting = this.renderSorting.bind(this);
        this.changeTypeSelection=this.changeTypeSelection.bind(this);
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

    componentWillMount() {
       this.props.getAllChangeType();
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
                    Header: () => (<span>Created Date/Time<img src={this.state.sort.createdDateFormat ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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
                    accessor: 'lastModifiedDate',
                    Header: () => (<span>Last Modified Date/Time<img src={this.state.sort.lastModifiedDate ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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

    formatDateTime(value) {
        return value ? moment(value).format("MM/DD/YYYY") + ' - ' + moment(value).format("HH:mm") + ' GMT' : ''
      }
       componentDidUpdate(prevProps) {
        const { resetSelectedChangeType } = this.props.adminData;
        if (prevProps.adminData.resetSelectedChangeType !== resetSelectedChangeType && resetSelectedChangeType) {
            this.setState({
                selectedCategory: [],
                selected: []
            }, () => {
                this.props.setSelectedChangeType(this.state.selectedCategory);
                this.props.resetSelectedChangeType(false);
            });
        }
    }



    changeTypeSelection(event, item) {
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
    checkAll(event){
          
        let changeTypeList = this.props.adminData.changeType
        let selectedCategory=[]
        let selected=[]
        if(event.target.checked){
        if(changeTypeList.length > 0){
            let length = changeTypeList.length
            for(let i=0 ; i <length ; i++){
                let item = changeTypeList[i]
              selectedCategory.push(item);
              selected.push(item.key);
            }
          }
        }

         this.setState({
            selectedCategory,
            selected
        });
    }
    renderList(list) {
        
        const { changeType, masterDataValues } = this.props.adminData;
        var itemArr = [];
        const { selected } = this.state;
        _.map(list, (item, index) => {
             var id = <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input " id={`checkBox-${item.key}`}
                    value={item.key} onClick={(e) => { this.changeTypeSelection(e, item) }}
                    checked={_.includes(selected, item.key) ? 'checked' : false} />
                        <span className="spanCheck custom-control-label"></span>
                <label className="custom-control-label margin" htmlFor={`checkBox-${item.key}`}></label>
            </div>
            item['selection'] = id;
            item['userFullName']= item.userFullName ? item.userFullName:''
            item['startDateFormat'] = moment(item.startDate).format('MM/DD/YYYY');
            item['endDateFormat'] = moment(item.endDate).format('MM/DD/YYYY');
            item['createdDateFormat'] = this.formatDateTime(item.createdDate);
            item['lastModifiedDate'] = this.formatDateTime(item.modifiedDate);
            let current=moment().utc().format('MM/DD/YYYY'); 
            item['status'] =moment(current).isBetween(item.startDateFormat, item.endDateFormat,null,'[]')?'Active':'In Active';
            itemArr.push(item);
        });
        return (
            <div className='col-md-12'>
                <CustomTable tableColumns={this.state.tableColumns} tableData={itemArr} sortingMethod={this.renderSorting} />
            </div>
        );
    }

    render() {
        const { changeType, loader } = this.props.adminData;
        this.state.loading = loader;
        return (
            <div className="row">
                <div className="col-md-12">
                    {this.state.loading ? <Loader /> : ''}
                    <div className="mt2 container-fluid ucm-body bg-color admin-panel-activityType">
                        <div className='row'>
                            <div className='col-md-12'>
                                <h2 className='mt10 bold'>Change Type</h2>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='float-right'>
                                     <ChangeTypeActions selectedCategory={this.state.selectedCategory} />
                                </div>
                            </div>
                            {changeType  ? this.renderList(changeType):null}
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
export default connect(mapStateToProps, actions)(withRouter(ChangeType));