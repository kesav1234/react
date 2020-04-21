import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from "moment/moment";
import * as actions from '../../redux/actionCreators';
import queryString from 'query-string';
import CountableTextArea from '../../../../app/molecules/CountableTextArea';
import { DatePicker } from '../../../../app/atoms';
import CategoryNameWrapper from '../../category-name-wrapper';
import { default as ValidateForm, ValidateItemExists } from '../../ValidateForm/validate-form';
import Button from "../../../../app/atoms/Button/Button";
import CustomSelect from '../../../../app/molecules/CustomSelect';
import CustomeMultiSelect from '../../../../app/molecules/CustomeMultiSelect';
import saveImg from '../../../../app/layout/assets/Save-white.svg';
import Discard from '../../../../app/layout/assets/close-alt_white.svg';
import { decrypt, replaceUnWantedChars } from '../../../../commonUtility';

class AddActivityTypeModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                activityType: '',
                startDate: '',
                description: '',
                activityCategoryId: '',
                // riskLevelId: '',
                comments:'',
                mopRequiredId: ''
                 
               
            },
            dateTime: {
                startDate: null
                
            },
            error:false,
            clear: false,
            dateError: false
        }
        this.setFormState = this.setFormState.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.saveActivityType = this.saveActivityType.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
        this.handleActivityTypeChange = this.handleActivityTypeChange.bind(this);
        this.toggleOptions = this.toggleOptions.bind(this);
        this.editActivityType=this.editActivityType.bind(this);
        this.handleDateChangeError = this.handleDateChangeError.bind(this);
    }

    componentWillMount() {
        const values = replaceUnWantedChars(this.props.location.search);    
        var decryptedValues = decrypt(values);
        if (decryptedValues) {
            this.setState({ vzid: decryptedValues });
        }
    }

    setFormState(name, value) {
        this.setState(prevState => ({
            form: {
                ...prevState.form, [name]: value
            }
        }));
    }

    toggleOptions(name) {
        this.setState({ currentComponent: name });
    }
    checkDate(current, previous){
       let days= current.diff(previous, 'days')
       if(days > 28) return true
       else return false
    }

    handleDateChange = (name, value) => {
        this.setState({ clear: false , 'dateError': false});
         if(this.props.type == 'Edit'){
            
            if(value._isAMomentObject){
             let currDate = moment(value, 'YYYY-MM-DD') 
              
             let prevDate =moment()
             let error= this.checkDate(currDate,prevDate)

             this.setState({ 'error': error})

            }
          }
    
        const { formError } = this.props.adminData;
        this.setState(prevState => ({
            dateTime: {
                ...prevState.dateTime, [name]: value
            }
        }));
        if (value) {
            if (formError[name]) {
                this.props.formErrors('', name);
            }
            var date = moment(value, 'MM/DD/YYYY');
            if (name === 'startDate' || name === 'createdDate') {
                date.startOf('day');
            } else {
                date.endOf('day');
            }
            this.setFormState(name, date.format('YYYY-MM-DD'));
            
        
        } else {
            this.setFormState(name, '');
        }
    }
    handleDateChangeError(isError, name){
        this.setState({'dateError': isError });
    }

    handleActivityTypeChange(e) {
        this.setState({ clear: false });
        const { activityType } = this.props.adminData;
        var name = e.target.name;
        var value = e.target.value;
        var result = ValidateItemExists('Activity Type', activityType, 'name', value);
        if (result) {
            this.props.formErrors({ [name]: result });
        } else {
            this.props.formErrors('', name);
        }
        this.setFormState(name, value);
    }

    handleInputChange(e) {
        this.setState({ clear: false });
        const { formError } = this.props.adminData;
        var name = e.target.name;
        var value = e.target.value;
        if (value && formError[name]) {
            this.props.formErrors('', name);
        }
        this.setFormState(name, value);
    }

    handleMultiSelectChange(value, name) {
        this.setState({ clear: false });
        const { formError } = this.props.adminData;
        let temp = [];
        const self = this;
        value.forEach((element) => {
            temp.push(element.key);
        });
        if (temp && temp.length > 0) {
            this.props.formErrors('', name);
        }
        this.setFormState(name, temp);
    }

    handleSelectChange(e, obj) {
        this.setState({ clear: false });
        const { formError } = this.props.adminData;
        let updatedKey = e.target.name;
        let updatedValue = obj ? obj.key : null;
        if (updatedValue && formError[updatedKey]) {
            this.props.formErrors('', updatedKey);
        }
        this.setFormState(updatedKey, updatedValue);
    }

     checkSave(type, data, editId){ 

         
        const { activityType } = this.props.adminData;
        var property = ['activityCategoryId'];
            var payloadArray = [];
           var cloneForm = _.clone(type == 'save' ? this.state.form: data);
            var omitProperty = _.omit(cloneForm, property);
            var activityCategoryId = cloneForm[property];
            var result = _.maxBy(activityType, (item) => { return item.id; });
            var id = (result) ? (Number(result.id) + 1) : 1;
          return  payloadArray = payloadArray.concat(_.map(activityCategoryId, (item) => {
                return ({
                    "id": type == 'save' ? (id ? id : 1) :editId,
                    "name": omitProperty.activityType,
                    "description": omitProperty.description,
                    "categoryId": item,
                    // "riskLevel": omitProperty.riskLevelId,
                    "startDate": omitProperty.startDate,
                    "mopRequired": omitProperty.mopRequiredId,
                    "createdBy": this.state.vzid,
                    "modifiedBy": this.state.vzid,
                    "duration": 0
                })
            }));
           

    
    }


    saveActivityType() {
        var result = ValidateForm(this.state.form);
        if (result.isValid) {
            if(!this.state.dateError){
                let payloadArray=this.checkSave('save',[])
                console.log({payloadArray})
                this.props.saveActivityType(payloadArray);
            } 
        } else {
            this.props.formErrors(result.formErrors);
        }
    }

    cancel() {
        this.setFormState('activityType', '');
        this.handleDateChange('startDate', '');
        this.setState({ clear: true });
        const { close } = this.props;
        this.props.formErrors({});
        close();
    }

    getCategoryIds(list){

         const { activeCategory } = this.props.adminData

        let ids=[]
        list.map((item)=>{
           let value= _.find(activeCategory, function (o) { return o.key === item.categoryId });
            ids.push(value)
        })

        return ids
    }
      componentDidUpdate(prevProps, prevState){ 

          if(prevProps.data != this.props.data){

             let form= {
                activityType: '',
                startDate: '',
                description: '',
                activityCategoryId: '',
                // riskLevelId: '',
                mopRequiredId: '',
              
               }


        if(this.props.type == 'Edit'){
             let data= [...this.props.data]

             let categoryIds = this.getCategoryIds(data)

             let startDateMoment = moment(data[0].startDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
             if(data.length > 0){

                 form= {
                     ...form,
                activityType: data[0].activityType,
                description: data[0].description,
                activityCategoryId: categoryIds,
                // riskLevelId: data[0].riskLevel,
                comments:'',
                mopRequiredId: data[0].mopRequired,
                startDate:data[0].startDate
               }

               this.setState({form:form, clear:false,  error:false , dateTime: { startDate: startDateMoment }})
              }
            } else {

               this.setState({form:form, clear:true,  error:false,error:false , dateTime: { startDate: null }})
            }
         }       
      }

      getCategoryList(list){
        let newList=[]
        list.map((category)=>{

            newList.push(category.key ? category.key : category)
        })

        return newList
      }

      getCategoryListByProps(list){

        let newList=[]
        list.map((category)=>{
            newList.push(category.categoryId)
        })

        return newList
      }

      checkAddCategory(newList, propList){

        return _.difference(newList, propList);
      }



       editActivityType(){
          
           
            console.log(this.state.form)
            var result = ValidateForm(this.state.form);
             if (!result.isValid) {
                this.props.formErrors(result.formErrors);
                return
              }

            let changedActivities = [...this.props.data]
            let form= _.cloneDeep(this.state.form)
            let newForm= _.cloneDeep(this.state.form)
            let categoryList =this.getCategoryList(form.activityCategoryId)
            let categoryListByProps=this.getCategoryListByProps(changedActivities)

            let editList=[]
            let addList=[]
              let items=[  
                           'activityCategoryId', 
                            'activityType',
                            'startDate',
                            'description',                        
                           /* 'riskLevelId',
                            'mopRequiredId' */ ]

            changedActivities.map(activity=>{
                let map={}
                
              
                    map['startDate'] = form['startDate']
                    map['activityType'] = form['activityType']
                    map['name']= form['activityType']
                    map['description'] = form['description']
                    // map['riskLevel'] = activity.riskLevel
                    map['categoryId']= activity.categoryId
                    map['comments']=form['comments']
                    map['id']=activity.id
                    map['key']=activity.key
                    map['modifiedBy']= this.state.vzid
                    map['createdBy'] = activity.createdBy
                    map['mopRequired'] = activity.mopRequired
                 
                    /* 
                    ** This is in case if Activity Category Field changed in Activity Type
                    ** @ oldCategoryId {string} is old activity category id in Activity Type
                    ** @ categoryId {string} the previous team set it up null 
                    */
                    if(!_.includes(categoryList,activity.categoryId)) {
                           map['categoryId']=null
                           map['oldCategoryId'] = activity.categoryId                            
                    }
          
                     editList.push(map)                    
            })

          let add=  this.checkAddCategory(categoryList,categoryListByProps)
         
          newForm['activityCategoryId']=add

          if(add.length > 0)
           addList=this.checkSave('edit',newForm,changedActivities[0].id)

            let newAddList = this.addEditKey(addList,editList.length > 0)
            /* 
            ** @ editList {array[]} of edited Activity Types, always has one element [0]
            ** @ newAddList {array[]} that will add Activity Type, always has one element [0]
            ** added to editList first element newCategoryId {string}, if Category Id is changed
            */
            if(newAddList[0]&&newAddList[0].categoryId&&editList[0]['categoryId'] === null){
                    editList[0]['newCategoryId'] = newAddList[0].categoryId
            }
            let finalMap={'edit':editList, 'add':newAddList}
            this.props.postEditActivityType(finalMap)
      }

   addEditKey(addList, condition){
            let newList=[]
            addList.map((addMap)=>{
               let map={...addMap, 'edit':condition}
                newList.push(map)
            })
            return newList
    }
    render() {
        const { activeCategory, formError, masterDataValues, searchCreatedList, loader, saveActivityType } = this.props.adminData;
        const { dateTime } = this.state;
        // const { riskLevel } = masterDataValues;

        let defaultStartDate = moment().subtract(1, 'days');
        let defaultCreatedDate = moment().subtract(1, 'days');
        let updatedStartDate = moment(this.state.dateTime.startDate).subtract(1, 'days');
        let startDateValid = function (current) {
            return current.isAfter(defaultStartDate);
        };
        let createdDateValid = function (current) {
            return current.isAfter(defaultCreatedDate);
        };
        if (saveActivityType) {
            this.props.getAllActivityCategory();
            this.props.getAllActivityType();
            this.props.clearSaveActivityType();
            this.cancel();
        }
        const mopRequiredList = [{ id: 'Y', key: 'Y', name: 'Yes' }, { id: 'N', key: 'N', name: 'No' }];

        var currentDate = moment().format('YYYY-MM-DD');
        var activeActivityCategory = _.filter(activeCategory, function (o) { return o.startDate <= currentDate && o.endDate >= currentDate });        
        
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className='row'>
                        <div className="col-md-4">
                            <CategoryNameWrapper
                                name={'activityType'}
                                defaultValue={this.state.form.activityType}
                                onBlur={this.handleActivityTypeChange}
                                label='Activity Type Name *'
                                error={formError.activityType}
                                errorMessage={formError.activityType}
                                clear={this.state.clear} />
                        </div>
                        <div className="col-md-4">
                            <div className="need-validated activityCategory">
                                <CustomeMultiSelect
                                    name={'activityCategoryId'} label={'Activity Category(s) *'}
                                    multiSelectSearch={true}
                                    options={activeActivityCategory} 
                                    selectedOptions={this.state.form.activityCategoryId}
                                    updateSelectedDevices={this.handleMultiSelectChange}
                                    error={formError.activityCategoryId}
                                    errorMessage={formError.activityCategoryId}
                                    tabIndex="0" clear={this.state.clear} />
                            </div>
                        </div>
                        {/* <div className="col-md-4">
                            <div className="need-validated">
                                <CustomSelect
                                    name={'riskLevelId'}
                                    label={'Risk Level *'}
                                    defaultValue={this.state.form.riskLevelId}       
                                    required={true}
                                    disabled={this.props.type == 'Edit' ? true:false}
                                    options={riskLevel}
                                    onChange={this.handleSelectChange}
                                    tabIndex="0"
                                    toggleOptions={this.toggleOptions}
                                    error={formError.riskLevelId}
                                    errorMessage={formError.riskLevelId}
                                    clear={this.state.clear} />
                            </div>
                        </div> */}
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="need-validated">
                                <CustomSelect
                                    name={'mopRequiredId'}
                                    label={'MOP Required *'}
                                    defaultValue={this.state.form.mopRequiredId}
                                    disabled={this.props.type == 'Edit' ? true:false}
                                    required={true}
                                    options={mopRequiredList}
                                    onChange={this.handleSelectChange}
                                    tabIndex="0"
                                    toggleOptions={this.toggleOptions}
                                    error={formError.mopRequiredId}
                                    errorMessage={formError.mopRequiredId}
                                    clear={this.state.clear} />
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className="form-group">
                                <DatePicker 
                                    onChange={val => { this.handleDateChange('startDate', val) }}
                                    name={'startDate'} label={'As of Date *'} dateFormat={true} timeFormat={false}
                                    required={true} defaultValue={this.state.dateTime.startDate}
                                    isValidDate={startDateValid}
                                    value={this.state.dateTime.startDate} 
                                    clear={this.state.clear}
                                    dispConflicts="form-control"
                                    minDate={new Date()}
                                    autocomplete="off"
                                    error={formError.startDate}
                                    errorMessage={formError.startDate}
                                    clear={this.state.clear} 
                                    onDateError={this.handleDateChangeError} />
                         { this.state.error  ?    
                          <span style={{color:'#ED7000'}}>As of Date is greater than 30 days from current day. Are you sure you want to proceed ? </span> : '' }
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-md-12'>
                            <CountableTextArea
                                onChange={this.handleInputChange}
                                 defaultValue={this.state.form.description}
                                id={'description'}
                                label={'Description *'}
                                name={'description'} required={true} limit={500} onClick={this.handleInputChange}
                                error={formError.description}
                                errorMessage={formError.description}
                                clear={this.state.clear} />
                        </div>
                    </div>
                   {this.props.type == 'Edit' ?    
                      <div className="row">
                        <div className='col-md-12'>
                            <CountableTextArea
                                onChange={this.handleInputChange}
                                 defaultValue={this.state.form.comments}
                                id={'comments'}
                                label={'Comments *'}
                                name={'comments'} required={true} limit={500} onClick={this.handleInputChange}
                                error={formError.comments}
                                errorMessage={formError.comments}
                                clear={this.state.form.comments == ''? true : false } />
                        </div>
                    </div> : ''}
                    <div className='row'>
                        <div className="col-md-12 col-lg-3">
                            <Button title="Save" className="btn request-btn" 
                            onClick={this.props.type == 'Add' ? 
                              this.saveActivityType :  this.editActivityType}  />
                        </div>
                        <div className="col-md-12 col-lg-2">
                            <Button title="Cancel" className="btn clear-btn" onClick={this.cancel} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    const { adminData } = state;
    return { adminData };
}
export default connect(mapStateToProps, actions)(withRouter(AddActivityTypeModel));