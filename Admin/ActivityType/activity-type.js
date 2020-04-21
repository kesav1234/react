import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../redux/actionCreators';
import CustomTable from '../../../app/molecules/CustomTable/CustomTable';
import AddActivityType from './add-activity-type';
import moment from "moment/moment";
import Modal from "../../../app/molecules/Modal";
import Loader from '../../../app/atoms/Loader';
import sortDec from '../../../app/layout/assets/sort.svg';
import sortAsc from '../../../app/layout/assets/sort-up.svg';
import FilterImg from '../../../app/layout/assets/filter.svg';
import DownArrowImg from '../../../app/layout/assets/Dropdown-arrow.svg';
import RightArrowImg from '../../../app/layout/assets/Arrow-right-black.svg';
import EditImg from '../../../app/layout/assets/edit.svg';
import ClockImg from '../../../app/layout/assets/Clock.svg';
import HistoryImg from '../../../app/layout/assets/history.svg';
import AddImg from '../../../app/layout/assets/add.svg';
import CloseImg from '../../../app/layout/assets/remove-item.svg';
import SaveImg from '../../../app/layout/assets/schedule_black.svg';
import api from '../../../api';
// import EditGrey from '../../../../app/layout/assets/Edit_grey.svg';
import EditGrey from '../../../app/layout/assets/Edit_grey.svg';


class ActivityType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            itemArr: [],
             activeCategory:"",
             activityType:"",
             edit:false,
             displayList:[],
            sort: {
                name: '',
                startDateFormat: '',
                endDateFormat: '',
                description: '',
                activityCategoryName: '',
                // riskLevelName: '',
                createdDateFormat: '',
                userFullName: '',
                modifiedDateFormat: '',
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
            selectedID:[],
            selectedMap: {},
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
                    accessor: 'activityCategoryName',
                    Header: () => (<span>Activity Category<img src={this.state.sort.activityCategoryName ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                // {
                //     accessor: 'riskLevelName',
                //     Header: () => (<span>Risk Level<img src={this.state.sort.riskLevelName ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                //     Filter: ({ filter, onChange }) =>
                //         <div>
                //             <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                //             <img className='filter-icon' src={FilterImg} alt='filter' />
                //         </div>,
                //     className: 'activity-grid-columns',
                //     headerClassName: 'activity-grid-columns'
                // },
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
                    accessor: 'mopRequiredFormat',
                    Header: () => (<span>MOP Required<img src={this.state.sort.mopRequiredFormat ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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
                    accessor: 'lastModifiedDate',
                    Header: () => (<span>Last Modified Date<img src={this.state.sort.lastModifiedDate ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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
                }],
            showCategoryModal: false
        }
        this.renderSorting = this.renderSorting.bind(this);
        this.handleViewHistory = this.handleViewHistory.bind(this);
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


    componentDidMount() {
        this.props.getAdminValues();
        this.props.getAllActivityCategory();
        this.props.getAllActivityType();
    }

    checkCondition(list,checkItem){
    console.log('740 =>',list,checkItem)
     let condition= false

    if(list.length > 0){
        list.map((item)=>{
            
            if(item.name === checkItem.name && item.description === checkItem.description &&
            //   item.riskLevel === checkItem.riskLevel && 
              item.startDate === checkItem.startDate &&
              item.mopRequired === checkItem.mopRequired ){
                condition=true
              }
        })
     } else condition= true

     return condition
    }

      checkClick(event, item) {

        var { selected,selectedMap } = this.state;

        if (event.target.checked) {
            let condition =this.checkCondition([...Object.values(selectedMap)],item)
            console.log('740 =>',condition)
            if(true){
                selected.push(item.key)
                selectedMap[item.key]=item
            }
            
        } else {
            if (selected.length > 0) {
                _.remove(selected, function (n) {
                    if(n === item.key){
                     delete selectedMap[item.key]
                     return true
                    } else return false
                    
                });
            }
        }
        let selectedID = [];
        console.log('Object.values(selectedMap) =>',Object.values(selectedMap))
        Object.values(selectedMap).forEach(item=>{
            selectedID.push(item.id);
        })
        console.log('selectedID',selectedID)
        this.setState({selectedID})
        
         let {activityType} = this.state

         let processedActivityList =  []
          _.map(activityType, (item, index) => {  
            if(item.categoryId !=null)    
             processedActivityList.push(this.tableDataFormation(item, this.state.selected))
       
        });


        console.log('740 =>',selectedID,selected,selectedMap,event.target.checked)
        console.log('740 =>',processedActivityList)
        this.setState({
            displayList:processedActivityList,
            selected: selected
        });
      
    }

  componentDidUpdate(prevProps, prevState){

 
  if(!_.isEmpty(this.props.masterDataValues)){
   if(this.props.activeCategory !== this.state.activeCategory || prevProps.addEdit !== this.props.addEdit ||
      this.props.activityType !== this.state.activityType){

        let activeCategory = this.props.activeCategory
         let activityType = this.props.activityType
          let processedActivityList =  []

        if(!_.isEmpty(activeCategory) && !_.isEmpty(activityType) ) {
        
          _.map(activityType, (item, index) => {  
            if(item.categoryId !=null){
              let map=this.tableDataFormation(item,[])
              processedActivityList.push(map)
            }
       
         });
        }
        this.setState({ activeCategory:activeCategory,
                        activityType:activityType,
                         selected: [],
                        selectedMap: {},
                        displayList:processedActivityList })
        

      }
    }    
 }
  static getDerivedStateFromProps(nextProps, prevState) {

        if( nextProps.loader !== prevState.loader){
              
              return{
                loader: nextProps.loader
              }

        } return null
  }

  shouldComponentUpdate(nextProps, nextState) {

if(!_.isEmpty(nextProps.masterDataValues)){
   
   if(nextProps.activityType != "" && nextProps.activeCategory != ""){
     
       if(nextState.activityType !== nextProps.activityType ||
           nextState.activeCategory !== nextProps.activeCategory ){
           return true    
     } else  if(nextState !== this.state ){
            return true  
     }else if( this.props.addEdit !== nextProps.addEdit){

            if(!nextProps.addEdit['add'] && !nextProps.addEdit['edit'] && nextProps.addEdit['editData'].length == 0 ){
                return true
            } else return false
     } else  return false
   
    } else 
         return false
    } else  if(nextProps.loader !== this.props.loader ){
            return true  
     }else 
         return false
  }


    tableDataFormation(item,selected){
       
        const  masterDataValues  = this.props.masterDataValues;
        // const { riskLevel } = masterDataValues;

    
        const activeCategory= this.props.activeCategory
       
           let map=item

            // var riskLevelName = riskLevel && riskLevel.length > 0 && riskLevel.find((val) => val.key === item.riskLevel);
            var activeCategoryName = activeCategory && activeCategory.length > 0 && activeCategory.find((val) => val.key === item.categoryId);
            var id = <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input " id={`checkBox-${item.key}`}
                     value={item.requestId} 
                     checked={_.includes(selected, item.key) ? 'checked' : false}
                     onClick={(e) => { this.checkClick(e, item) }}
                   />
                        <span className="spanCheck custom-control-label"></span>
                <label className="custom-control-label margin" htmlFor={`checkBox-${item.key}`}></label>
            </div>
            map['selection']  = id;
            map['startDateFormat'] = moment(item.startDate).format('MM/DD/YYYY');
            map['startDate'] = moment(item.startDate).format('YYYY-MM-DD')
            map['activityType'] = item.name
            // map['riskLevel'] = item.riskLevel
            map['mopRequired'] = item.mopRequired
            map['createdBy'] = item.createdBy
            map['endDateFormat'] = moment(item.endDate).format('MM/DD/YYYY');
            map['activityCategoryName'] = (activeCategoryName) ? activeCategoryName.name : '';
            // map['riskLevelName'] = (riskLevelName) ? riskLevelName.name : '';
            map['createdDateFormat'] = moment(item.createdDate).format('MM/DD/YYYY');
            map['modifiedDateFormat'] = moment(item.modifiedDate).format('MM/DD/YYYY');
            map['mopRequiredFormat'] = (item.mopRequired) ? ((item.mopRequired === 'N') ? 'No' : 'Yes') : '';
            map['lastModifiedDate'] = moment(item.lastModifiedDate).format('MM/DD/YYYY');
            let current=moment().utc().format('MM/DD/YYYY'); 
            item['status'] =moment(current).isBetween(item.startDateFormat, item.endDateFormat,null,'[]')?'Active':'In Active';
         
       return map
      
    }

   editActivityType=()=>{
     let map={'add':false, 'editData':[...Object.values(this.state.selectedMap)],'edit':true}
     this.props.addEditActivityType(map)
     this.props.showActivityType(true)
   }

   addActivityType=()=>{
     let map={'add':true, 'editData':[],'edit':false}
     this.props.addEditActivityType(map)
     this.props.showActivityType(true)
   }

   handleViewHistory = () =>{
    console.log('this.state.selectedMap =>',this.state.selectedMap,this.state.selected,this.state.selectedID);
    this.props.viewHistoryOfActivityType(this.state.selectedID);
    this.props.showActivityType(false);
   }


    render() {
         const  loader= this.state.loader;
      
        return (
            <div className="row">
                <div className="col-md-12">
                    {loader ? <Loader /> : ''}
                    <div className="mt2 container-fluid ucm-body bg-color admin-panel-activityType">
                        <div className='row'>
                            <div className='col-md-12'>
                                <h2 className='mt10 bold'>Activity Type</h2>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='float-right'>

								
									<h3 className={`float-left ml25 ` + (this.state.selected.length === 1 ? 'pointer' : ' icon-disable')}
                                         onClick={this.state.selected.length === 1 ? this.editActivityType : ''}>
                                        <img src={this.state.selected.length === 1?EditImg:EditGrey} className='icon' style={{ height: 20 }} alt='Edit' id='edit' /> Edit</h3>
                                    {/* GTSO-3221 - feature enhancement
                                    <h3 className={`float-left ml25 ` + (this.state.selected.length > 0 ? 'pointer' : ' icon-disable')}>
                                        <img src={CloseImg} className='icon' style={{ height: 20 }} alt='Delete' /> Delete</h3> */}

                                     <h3 className={`float-left ml25 pointer` }  onClick={this.addActivityType}>
                                        <img src={AddImg} className='icon' style={{ height: 20 }} alt='Add' /> Add</h3>
                                    <h3 className={`float-left ml25 ${this.state.selected.length<1?'icon-disable' : ' pointer '}` }  onClick={this.state.selected.length<1?'':this.handleViewHistory}>
                                        <img src={this.state.selected.length<1?ClockImg:HistoryImg} className='icon' style={{ height: 20 }} alt='Add' /> View History
                                    </h3>
                                </div>
                            </div>
                             <div className='col-md-12'>
                             <CustomTable tableColumns={this.state.tableColumns} 
                           tableData={this.state.displayList} sortingMethod={this.renderSorting} />
                           </div>
                             <AddActivityType /> 
                        </div>
                    </div>
                </div>
            </div>);
    }
}
function mapStateToProps(state) {
 

    return {
        activeCategory: state.adminData.activeCategory,
        masterDataValues:state.adminData.masterDataValues,
        activityType: state.adminData.activityType,
        loader:state.adminData.loader,
        addEdit: state.adminData.addEditActivityData
       
    };
}
export default connect(mapStateToProps, actions)(withRouter(ActivityType));