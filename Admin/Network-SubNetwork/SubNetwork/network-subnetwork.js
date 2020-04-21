import React, { useState, useEffect } from 'react';
import moment from "moment/moment";
import NetworkSubnetworkActions from './network-subnetwork-actions';
import CustomTable from '../../../../app/molecules/CustomTable/CustomTable';
import sortDec from '../../../../app/layout/assets/sort.svg';
import sortAsc from '../../../../app/layout/assets/sort-up.svg';
import FilterImg from '../../../../app/layout/assets/filter.svg';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../../../../app/atoms/Loader';
import _ from 'lodash';
import { getAllSubNetworkAssociations } from '../../redux/actionCreators'

const NetworkSubnetwork = () => {
    const [sort, setSort] = useState({
        name: '',
        subNetwork: '',
        status: '',
        startDateFormat: '',
        endDateFormat: '',
        userFullName: '',
        createDateFormat: '',
        modifiedBy: '',
        modifiedDateFormat: ''
    })
    const dispatch = useDispatch();
    const [selectedNetworkSubNetwork, setSelectedNetworkSubNetwork] = useState([]);
    const { subNetworkAssociations } = useSelector((state) => {
        return {
            subNetworkAssociations: state.adminData.subNetworkAssociations,
        }
    })

    useEffect(() => {
        if(!subNetworkAssociations) {
            dispatch(getAllSubNetworkAssociations())
        }
    }, [subNetworkAssociations])

    console.log({subNetworkAssociations});
    const activeNetworkSubNetworkSelection = (event, item) => {
        var selectedNetworks = [...selectedNetworkSubNetwork];
        if (event.target.checked) {
            selectedNetworks.push(item.key);
        } else {
            _.remove(selectedNetworks, function (n) {
                return n === item.key;
            });
        }
        setSelectedNetworkSubNetwork(selectedNetworks);
    }

    const renderSorting = (header, val) => {
        if (header) {
            setSort(({ sort }) => (
                {
                    sort: Object.assign({}, sort, { [header]: !val })
                }
            ));
        }
    }
   
    const tableData = (list) => {
        var itemArr = [];
        _.map(list, (item, index) => {
            var id = <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input " id={`checkBox-${item.key}`}
                    value={item.key} onClick={(e) => { activeNetworkSubNetworkSelection(e, item) }}
                    checked={_.includes(selectedNetworkSubNetwork, item.key) ? 'checked' : false} />
                        <span className="spanCheck custom-control-label"></span>
                <label className="custom-control-label margin" htmlFor={`checkBox-${item.key}`}></label>
            </div>
            const name = (item.networks && item.networks[0] ? (item.networks[0].name || '' ) : '')
            item['selection'] = id;
            item['network'] = name
            item['subNetwork'] = item.name.toUpperCase()
            item['startDateFormat'] = moment(item.startDate).format('MM/DD/YYYY');
            item['endDateFormat'] = moment(item.endDate).format('MM/DD/YYYY');
            item['createdDateFormat'] = moment(item.createdDate).format('MM/DD/YYYY');
            item['userFullName'] = item.userFullName
            item['modifiedDateFormat'] = moment(item.modifiedDate).format('MM/DD/YYYY');
            item['modifiedBy'] = item.userFullName
            item['status'] =  moment().isBetween(item.startDateFormat, item.endDateFormat, null, '[]') ? 'Active' : 'In Active';
            itemArr.push(item);
        });
        return itemArr;
    }
    const  tableColumns = [
        {
            accessor: 'selection', Header: () => (<div className="custom-control">
                
                <label className=" margin" htmlFor="customControlValidation1"></label>
            </div>), filterable: false, sortable: false, width: 50
        },
        {
            accessor: 'network',
            Header: () => (<span>Network<img alt='filter' src={sort.name ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
            Filter: ({ filter, onChange }) =>
                <div>
                    <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                    <img className='filter-icon' src={FilterImg} alt='filter' />
                </div>,
            className: 'activity-grid-columns',
            headerClassName: 'activity-grid-columns'
        },
        {
            accessor: 'subNetwork',
            Header: () => (<span>Sub-Network<img alt='filter' src={sort.subNetwork ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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
            Header: () => (<span>Status<img alt='filter' src={sort.status ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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
            Header: () => (<span>Start Date<img alt='filter' src={sort.startDateFormat ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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
            Header: () => (<span>End Date<img alt='filter' src={sort.endDateFormat ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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
            Header: () => (<span>Created Date<img alt='filter' src={sort.createdDateFormat ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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
            Header: () => (<span>Created By<img alt='filter' src={sort.userFullName ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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
            Header: () => (<span>Last Modified Date<img alt='filter' src={sort.modifiedDateFormat ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
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
            Header: () => (<span>Last Modified By<img alt='filter' src={sort.modifiedBy ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
            Filter: ({ filter, onChange }) =>
                <div>
                    <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                    <img className='filter-icon' src={FilterImg} alt='filter' />
                </div>,
            className: 'activity-grid-columns',
            headerClassName: 'activity-grid-columns'
        }
    ]
    const { loading } = useSelector((state)=> {
        return {
            loading: state.adminData.loader
        }
    })
    return (
        <div className="row" style={{marginTop: '300px'}}>
            <div className="col-md-12">
                {loading ? <Loading /> : ''}
                <div className="mt2 container-fluid ucm-body bg-color admin-panel-activityType">
                    <div className='row'>
                        <div className='col-md-12'>
                            <h2 className='mt10 bold'>Sub-Network</h2>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12'>
                            <NetworkSubnetworkActions selectedNetworkSubNetwork={selectedNetworkSubNetwork} />
                        </div>
                        <div className='col-md-12'>
                            <CustomTable 
                                tableColumns={tableColumns}
                                tableData={tableData(subNetworkAssociations)}
                                sortingMethod={renderSorting}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NetworkSubnetwork;
                       
