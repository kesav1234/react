
import React,{Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import moment from "moment/moment";
import CustomTable from '../../../app/molecules/CustomTable/CustomTable';
import FilterImg from '../../../app/layout/assets/filter.svg';
import sortDec from '../../../app/layout/assets/sort.svg';
import sortAsc from '../../../app/layout/assets/sort-up.svg';
class ChangeTypeHistoryLog extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableColumns:[],
            sort:{
                'id':'',
                'name':'',
                'oldValue':'',
                'newValue':'',
                'itemChanged':'',
                'modifiedBy':'',
                'comment':'',
                'modifiedDate':''
            }
        }
        this.renderSorting = this.renderSorting.bind(this);
    }
    componentDidMount(){
        this.setState({
            tableColumns: [
                {
                    accessor: 'id',
                    Header: () => (<span>Id<img src={this.state.sort.id ? sortAsc : sortDec} alt=' filter id ascending - descending' className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input  onChange={event => onChange(event.target.value)}  value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'name',
                    Header: () => (<span>Name<img src={this.state.sort.name ? sortAsc : sortDec}  alt=' filter name ascending - descending' className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)}  value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'oldValue',
                    Header: () => (<span>Old Value<img src={this.state.sort.oldValue ? sortAsc : sortDec} alt='filter old value ascending - descending' className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'newValue',
                    Header: () => (<span>New Value<img src={this.state.sort.newValue ? sortAsc : sortDec} alt='filter new value ascending - descending' className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'itemChanged',
                    Header: () => (<span>Item Changed<img src={this.state.sort.itemChanged ? sortAsc : sortDec} alt='filter item changed ascending - descending' className='table-sort-icon custom-table' /></span>),
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
                    Header: () => (<span>Modified By<img src={this.state.sort.modifiedBy ? sortAsc : sortDec} alt='filter modified by ascending - descending' className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                },
                {
                    accessor: 'comment',
                    Header: () => (<span>Comment<img src={this.state.sort.comment ? sortAsc : sortDec} alt='filter comment ascending - descending' className='table-sort-icon custom-table' /></span>),
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
                    Header: () => (<span>Modified Date<img src={this.state.sort.modifiedDate ? sortAsc : sortDec} alt='filter modified date ascending - descending' className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) =>
                        <div>
                            <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            <img className='filter-icon' src={FilterImg} alt='filter' />
                        </div>,
                    className: 'activity-grid-columns',
                    headerClassName: 'activity-grid-columns'
                }
            ]
        });
    }
    renderList(list) {
        let Logs = [];

        // ! RegDate is regex which will check if the value equals yyyy-mm-dd format

        let RegDate = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;

        _.map(list, (item, index) => {
            item['id'] = item.id;
            item['name'] = item.name;
            item['oldValue'] = RegDate.test(item.oldValue) && moment(item.oldValue).format('MM/DD/YYYY') !== 'Invalid date'?moment(item.oldValue).format('MM/DD/YYYY'):item.oldValue;
            item['newValue'] = RegDate.test(item.newValue) && moment(item.newValue).format('MM/DD/YYYY') !== 'Invalid date'?moment(item.newValue).format('MM/DD/YYYY'):item.newValue;
            item['itemChanged'] = item.itemChanged;
            item['modifiedBy'] = item.modifiedBy;
            item['comment'] = item.comment;
            item['modifiedDate'] = moment(item.modifiedDate).format('MM/DD/YYYY');
            Logs.push(item);
        });
        return (
            <div className='col-md-12'>
                <CustomTable defaultPageSize={5} tableColumns={this.state.tableColumns} tableData={Logs} sortingMethod={this.renderSorting} />
            </div>
        );
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
    render(){
 
        return(
            <div>
                {this.props.changeTypeHistoryAvailable?this.renderList(this.props.changeTypeHistoryLog):null}
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        changeTypeHistoryLog: state.adminData.changeTypeHistoryLog,
        changeTypeHistoryAvailable: state.adminData.changeTypeHistoryAvailable
    }  
}

export default connect(mapStateToProps,null)(ChangeTypeHistoryLog);