import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { instanceOf } from 'prop-types';
import moment from 'moment';
import { toast } from "react-toastify";
import sortDec from '../../../app/layout/assets/sort.svg';
import sortAsc from '../../../app/layout/assets/sort-up.svg';
import FilterImg from '../../../app/layout/assets/filter.svg';
import RevokeAccess from '../../../app/layout/assets/Revoke_user_access.svg';
import * as actions from '../redux/actionCreators';
import queryString from 'query-string';
import CustomTable from '../../../app/molecules/CustomTable/CustomTable';
import RevokeAccessLoader from './loader'
import Confirmation from './confirmation';
import { encrypt, decrypt, replaceUnWantedChars } from '../../../commonUtility';
import { constants } from 'zlib';
import * as Constants from '../../../Constants';

class RevokeUserAccess extends Component {


constructor(props){
    super(props)
    this.state={
            allUsers:[],
            checkUsers:[],
             displayList:[],
             checkAll:false,
             showAll:false,
             useNameMap:{},
             showActive:false,
              tableColumns: [
                {
                    accessor: 'selection', Header: () => (<div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" 
                         checked={ this.state.checkAll ? 'checked' : false}
                        id="customControlValidation1" required onClick={(e) => { this.checkAll(e) }} />
                        <span className="spanCheck custom-control-label"></span>
                        <label className="custom-control-label margin" htmlFor="customControlValidation1"></label>
                    </div>),width:80, filterable: false, sortable: false
                },
                {
                    accessor: 'vzId', Header: () => (<span>Vz ID<img src={this.state.sort.vzId ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) => <div>
                        <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                        <img className='filter-icon' src={FilterImg} alt='filter' /> </div>, width:120
                },
                {
                    accessor: 'firstName',
                    Header: () => (<span>First Name<img src={this.state.sort.firstName ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) => <div>
                        <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                        <img className='filter-icon' src={FilterImg} alt='filter' /> </div>, width:120
                },
                {
                    accessor: 'lastName',
                    Header: () => (<span>Last Name<img src={this.state.sort.lastName ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) => <div>
                        <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                        <img className='filter-icon' src={FilterImg} alt='filter' /> </div>, width:120
                },
                {
                    accessor: 'statusName',
                    Header: () => (<span> Status<img src={this.state.sort.statusName ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) => <div>
                        <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                        <img className='filter-icon' src={FilterImg} alt='filter' /> </div>, width:120
                },
                {
                    accessor: 'email',
                    Header: () => (<span>Email<img src={this.state.sort.email ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) => <div>
                        <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                        <img className='filter-icon' src={FilterImg} alt='filter' /> </div>, width:220
                },
                {
                    accessor: 'phone',
                    Header: () => (<span>Phone<img src={this.state.sort.phone ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>),
                    Filter: ({ filter, onChange }) => <div>
                        <input onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                        <img className='filter-icon' src={FilterImg} alt='filter' /> </div>, width:140
                },
                {
                     accessor: 'roles', Header: () => (<span>Roles<img src={this.state.sort.roles ? sortAsc : sortDec} className='table-sort-icon custom-table' /></span>), 
                     className: 'customRevokeHeight',
                     filterMethod: (filter, row) => {
            
                        if(typeof row.roles == 'object'){
                             let list=row.roles
                                if(list.length > 0){

                            let finalString=''
                             list.map((li)=>{
                                 let innerList= li ? (li.props ? (li.props.children  ? li.props.children : '') : ''):''
                                finalString = finalString+' '+innerList[1].toLowerCase()                      
                             })
                    if(finalString.includes(filter.value ? filter.value.toLowerCase():''))
                         return true 
                             }
                          }else {       
                       return row[filter.id].includes(filter.value)
                         }
                   
                     },
                  Filter: ({ filter, onChange }) => <div>
                     <input
                     onChange={event => onChange(event.target.value)}
                     value={filter ? filter.value : ''}
                     /><img className='filter-icon' src={FilterImg} alt='filter' /> </div>
                 },],    
            sort:{
                vzId:'',
                firstName:'',
                lastName:'',
                statusName:'',
                email:'',
                phone:'',
                roles:''
               },
                revokeAcess: false,
                selected: {}             
        } 
         this.renderSorting = this.renderSorting.bind(this);
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


componentDidMount(){
    this.props.getAllUsers()
}

shouldComponentUpdate(nextProps, nextState) {
   
   if(nextProps.allUsers != ""){
     
       if(nextState.allUsers !== nextProps.allUsers ){
           return true    
     } else  if(nextState.displayList !== this.state.displayList ){
            return true  
     } else 
         return false
   
    } else 
         return false
   
  }


   

   checkClick(event, item) {

     
        let selected = {...this.state.selected}

        if (event.target.checked) {
            selected[item.id]=item
        } else {
            if (!_.isEmpty(selected)) {
              
                   delete selected[item.id];
               
            }
        }

         let processedUserList =  []
         let {allUsers}= this.state
         let selectedIds= Object.keys(selected)
          _.map(allUsers, (item, index) => {  
             let userAccessRequest= item.userAccessRequest.length > 0 ? item.userAccessRequest[item.userAccessRequest.length -1 ]:{}
                if(this.state.showActive){
                    if(userAccessRequest.approvalStatus == 'A')
                     processedUserList.push(this.tableDataFormation(item,selectedIds))
                } else {
                    processedUserList.push(this.tableDataFormation(item,selectedIds))
                }
       
        });

     

        this.setState({
            displayList:processedUserList,
            selected: selected
        });
      
    }

      checkAll(e) {
     
        var { allUsers } = this.state;
        let selected={}
        let checkAll=false
        let activeUsers=[]

        if (e.target.checked) {  
           
          _.map(allUsers, (item, index) => {      
            let userAccessRequest= item.userAccessRequest.length > 0 ? item.userAccessRequest[item.userAccessRequest.length -1 ]:{} 
            selected[item.id]=item

           if(userAccessRequest.approvalStatus == 'A')
             activeUsers.push(item.id) 
          }); 
           
        } else {
            selected={}
            checkAll=false

        }

        if(activeUsers.length > 0)  checkAll=true

         let processedUserList =  []
          let selectedIds= Object.keys(selected)

          _.map(allUsers, (item, index) => { 
            let userAccessRequest= item.userAccessRequest.length > 0 ? item.userAccessRequest[item.userAccessRequest.length -1 ]:{}
                if(this.state.showActive){
                    if(userAccessRequest.approvalStatus == 'A')
                     processedUserList.push(this.tableDataFormation(item,selectedIds))
                } else {
                    processedUserList.push(this.tableDataFormation(item,selectedIds))
                }
               

        });

         this.setState({
            displayList:processedUserList,
            selected: selected,
            checkAll:checkAll
        });
    }

  
    getRoles(roles){
    
        if(roles.length > 0){
          return  roles.map((val)=>{
            return <div className="roleCls"> {val.name} </div>
          })
        } else {
            return []
        }
       
    }

    getStatus(userAccessRequest){

         if(userAccessRequest.approvalStatus == 'P' ) return 'Pending'
          else if(userAccessRequest.approvalStatus == 'A' ) return 'Active'
         else return 'Inactive'
            
        
          
    }
   tableDataFormation(item, selected){
     let { allUsers} = this.state;
    let map={...item}
    let displayName=''
    let nameCondition =false
    if(item.displayName.includes(',')){
        displayName=item.displayName.split(',')
        nameCondition=true
    }    
     else
     displayName=item.displayName

            let userAccessRequest= item.userAccessRequest.length > 0 ? item.userAccessRequest[item.userAccessRequest.length -1 ]:{}
              var id = <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input " id={`checkBox-${item.id}`}
                    value={item.id} 
                     checked={_.includes(selected, item.id.toString()) ? 'checked' : false}
                     onClick={(e) => { this.checkClick(e, item) }}
                   />
                <span className="spanCheck custom-control-label"></span>
                <label className="custom-control-label margin" htmlFor={`checkBox-${item.id}`}></label>
            </div>
            map['selection']  = userAccessRequest.approvalStatus === 'A' ? id : undefined;
            map['vzId'] = item.name
            map['firstName'] = nameCondition && displayName.length > 0 ? displayName[1] : displayName
            map['lastName'] = nameCondition &&  displayName.length > 1 ? displayName[0] : ''
            map['statusName'] = this.getStatus(userAccessRequest)
            map['email'] =  item.email
            map['phone'] =  item.phone ? item.phone :''
            map['userAccess']=userAccessRequest
            map['roles'] =  this.getRoles(item.roles)

            return map

   }

   processList(showAll,showActive){
         
        let {allUsers} = this.props        
        const values = replaceUnWantedChars(this.props.location.search);    
        var decryptedValues = decrypt(values);
        let loggedUser = decryptedValues.toLowerCase();

         let processedUserList =  []
          _.map(allUsers, (item, index) => {
           if(item.name&&item.name.toLowerCase() !==loggedUser){
            let userAccessRequest= item.userAccessRequest.length > 0 ? item.userAccessRequest[item.userAccessRequest.length -1 ]:{}
        
            if(!showAll && !showActive)      
            processedUserList.push(this.tableDataFormation(item,[]))
            else if(showActive && !showAll){
               if(userAccessRequest.approvalStatus == 'A' )
                 processedUserList.push(this.tableDataFormation(item,[]))
            }else if(showAll && !showActive){
                 processedUserList.push(this.tableDataFormation(item,[]))
            }
           }
        });
        let newUsers= allUsers.filter(user=>  user.name&&loggedUser !== user.name.toLowerCase())
        
        this.setState({ allUsers:newUsers,
                        checkUsers:allUsers,
                        displayList:processedUserList,
                            showAll:showAll,
                            selected:{},
                             showActive:showActive,})

      }
   

    componentDidUpdate(prevProps, prevState){

    if(this.props.allUsers !== this.state.checkUsers){
        this.processList(false,false)
        this.getDisplayName()
    }
 }

  
showActive=()=>{

    let newList=[...this.state.allUsers]

    let displayList=[]

    newList.map((item)=>{
    let userAccessRequest= item.userAccessRequest.length > 0 ? item.userAccessRequest[item.userAccessRequest.length -1 ]:{}
        if(userAccessRequest.approvalStatus == 'A' ){
            displayList.push(this.tableDataFormation(item,[]))
        }
    })

    this.setState({displayList:displayList, selected:{}, showAll:false,
            showActive:true, checkAll:false})
}

getDisplayName(){
    let useNameList= this.props.allUsers.slice()
    let map={}
    useNameList.map((user)=>{
        map[user.id]=user.displayName.replace(/,/g, '')
    })
     this.setState({useNameMap:map})
    
}
getUserNameList(list){
    let nameList=[]
    let map = this.state.useNameMap
    list.map((id)=>{
        nameList.push(map[id])
    })
    return nameList
}

revokeAcess=()=>{
    const values = replaceUnWantedChars(this.props.location.search)
    let data= values ? values :false
    if(data){
       
        let map={'requestor':data.toUpperCase(), 'ids':Object.values(this.state.selected), 'comment':'' }
         this.props.revoke(map);
    } else{
         toast.error(Constants.ERROR_OCCURRED)
    }
}

showAll=()=>{

    let newList=[...this.state.allUsers]

    let displayList=[]

    newList.map((user)=>{

            displayList.push(this.tableDataFormation(user))

    })

    this.setState({displayList:displayList, 
             showAll:true,
            showActive:false,selected:{}, checkAll:false})
}

closeRevoke(val){
    if(val)
    this.processList(this.state.showAll, this.state.showActive)
}

render(){

     if (this.props.confirmation.revoke) {
            this.props.getAllUsers()  
            let map = { condition: false, data: {}, revoke: false }
            this.props.confirmRevoke(map);        
        }

     return(

          <div className="row">
                <div className="col-md-12">
                    <div className="mt2 container-fluid ucm-body bg-color">
                       <div className='row'>
                            <div className='col-md-5'>
                                <h2 className='mt10 bold'>Revoke User Access</h2>
                            </div>
                            <div className='col-md-5'>
                                <div className="action-area">
                                    
                                    <a className={`float-left ml25  pointer revokeAccessIcons  `+ (this.state.showAll ? 'revokeAccess' : '')}
                                         onClick={this.showAll} >
                                          All Users
                                     </a>
                                     <a className={`float-left ml25  pointer revokeAccessIcons `+ (this.state.showActive ? 'revokeAccess' : '')}
                                        onClick={this.showActive} >
                                         Active Users
                                     </a>
                                     </div>
                
                            </div>
                             <div className='col-md-2'>
                                <div className='action-area'>
                                    <h3 className={`ml25 ` + (!_.isEmpty(this.state.selected) ? 'pointer' : ' icon-disable')}
                                     onClick={(!_.isEmpty(this.state.selected)) ? this.revokeAcess: ''}  >
                                     <img src={RevokeAccess} className='icon' style={{ height: 15 }} alt='Revoke Access' />  Revoke Access
                                     </h3>
                                </div>
                             </div>
                            <div id="revokeAccess"
                                className="container line-hgt">
                             <CustomTable tableColumns={this.state.tableColumns} 
                               tableData={this.state.displayList} sortingMethod={this.renderSorting} />
                             </div> 
                          <RevokeAccessLoader />
                        </div>
                    </div>
                </div>
            </div>
    
        )

      

}


}


function mapStateToProps(state) {
    
    return {
        allUsers:state.adminData.allUsers,
        confirmation: state.adminData.confirmRevoke
       
    };
}

export default connect(mapStateToProps, actions)(RevokeUserAccess)  