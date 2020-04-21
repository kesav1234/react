import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from "moment/moment";
import * as actions from '../redux/actionCreators';
import queryString from 'query-string';
import CountableTextArea from '../../../app/molecules/CountableTextArea';
import { DatePicker } from '../../../app/atoms';
import CategoryNameWrapper from '../category-name-wrapper';
import Button from "../../../app/atoms/Button/Button";
import saveImg from '../../../app/layout/assets/Save-white.svg';
import Discard from '../../../app/layout/assets/close-alt_white.svg';
import { default as ValidateForm, ValidateItemExists, checkDate } from '../ValidateForm/validate-form';
import Modal from "../../../app/molecules/Modal";
import { decrypt,replaceUnWantedChars } from '../../../commonUtility';

class ChangeTypeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                changeType: '',
                startDate: '',
                description: '',
                comments: '',
            },
            dateTime: {
                startDate: null,
            },
            clear: false,
            clearDate: false,
            dateError: false
        }
        this.setFormState = this.setFormState.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.saveChangeType = this.saveChangeType.bind(this);
        this.handleChangeTypeChange = this.handleChangeTypeChange.bind(this);
        this.setDateChange = this.setDateChange.bind(this);
        this.saveEditChangeType = this.saveEditChangeType.bind(this);
        this.formValidate = this.formValidate.bind(this);
        this.updateState = this.updateState.bind(this);
        this.closeNotify=this.closeNotify.bind(this);
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
    setDateChange = (name, value) => {
        this.setState({ clearDate: false, clear: false, dateError: false });
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
            if (name === 'startDate') {
                date.startOf('day');
            }
            this.setFormState(name, date.format('YYYY-MM-DD'));
        } else {
            this.setFormState(name, '');
        }
    }
    handleDateChange = (name, value) => {
        const { mode } = this.props;
        if (mode === 'edit') {
            let error = checkDate(moment(value), moment());
            this.setState({ 'error': error });
        }
        this.setDateChange(name, value);
    }

    handleChangeTypeChange(e) {
        this.setState({ clear: false });
        const { changeType } = this.props.adminData;
        var name = e.target.name;
        var value = e.target.value;
        var result = ValidateItemExists('Change Type', changeType, 'name', value);
        if (this.props.mode === 'edit') {
            let selected = _.first(this.props.adminData.selectedChangeType);
            if (value === selected['name']) {
                result = false;
            }
        }
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
    formValidate() {
        const { mode } = this.props;
        var cloneForm = _.clone(this.state.form);
        var validateControl = (mode === 'edit') ? cloneForm : _.omit(cloneForm, ['comments']);
        var result = ValidateForm(validateControl);
        if (!result.isValid) {
            this.props.formErrors(result.formErrors);
        }
        return result.isValid;
    }
    saveChangeType() {
        const { formError } = this.props.adminData;
        if (this.formValidate() && !formError.changeType && !this.state.dateError) {
            const { changeType } = this.props.adminData;
            var paylaod = [];
            var cloneForm = _.clone(this.state.form);
            var result = _.maxBy(changeType, (item) => { return item.id; });
            var id = (result) ? (Number(result.id) + 1) : 1;
            paylaod.push({
                "id": (id ? id : 1),
                "name": cloneForm.changeType,
                "description": cloneForm.description,
                "startDate": cloneForm.startDate,
                "createdBy": this.state.vzid,
                "modifiedBy": this.state.vzid,
                "comments": cloneForm.comments
            })
            this.props.saveChangeType(paylaod);
        }
    }
    saveEditChangeType() {
        const { formError } = this.props.adminData;
        if (this.formValidate() && !formError.changeType && !this.state.dateError) {        
            var cloneForm = _.clone(this.state.form);
            var cloneType = _.clone(this.props.adminData.selectedChangeType[0]);
            cloneForm.modifiedBy = this.state.vzid;
            cloneForm.name = cloneForm.changeType;
            var payload = _.assign({},
                _.pick(cloneForm, ['name', 'startDate', 'description', 'comments', 'modifiedBy']),
                _.pick(cloneType, ['id', 'createdBy']));
            this.props.editChangeType(cloneType.key, payload);
        }
    }

    cancel() {
        this.setFormState('changeType', '');
        this.handleDateChange('startDate', '');
        this.setState({ clear: true, clearDate: true });
        const { close } = this.props;
        this.props.formErrors({});
        close();
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState !== this.state) {
            return true;
        } else if (!_.isEmpty(nextProps.adminData)) {
            const { selectedChangeType, formError, saveChangeType } = this.props.adminData;
            if (nextProps.adminData.selectedChangeType !== selectedChangeType) {
                return true;
            } else if (nextProps.adminData.formError !== formError) {
                return true;
            } else if (nextProps.adminData.saveChangeType !== saveChangeType) {
                const { code } = nextProps.adminData.saveChangeType;
                if (code === 201 || code === 200) {
                    this.props.getAllChangeType();
                    this.cancel();
                }
            } else if (nextProps.mode !== this.props.mode) {
                return true;
            }
        }
        return false;
    }
    updateState(propertyValue) {
        this.setState(prevState => ({
            ...prevState,
            form: propertyValue['form'],
            dateTime: propertyValue['dateTime'],
            clear: propertyValue['clear'],
            clearDate: propertyValue['clearDate'],
            error: propertyValue['error']
        }));
    }
    closeNotify(){
        this.setState({ 'error': false });
    }
    componentDidUpdate(prevProps, prevState) {
        const { mode } = this.props;
        const { selectedChangeType } = this.props.adminData;
        var form = {
            changeType: '',
            startDate: moment(new Date()).format('YYYY-MM-DD'),
            description: '',
            comments: ''
        };
        var dateTime = {
            startDate: moment(new Date(), 'YYYY-MM-DD').format('MM/DD/YYYY')
        };
        if (mode === 'create' && prevProps.mode !== this.props.mode) {
            this.updateState({
                form: form,
                dateTime: dateTime,
                clear: true,
                clearDate: false,
                error: false
            });
        } else if (mode === 'edit' && prevProps.adminData.selectedChangeType !== selectedChangeType) {
            var clear = true;
            if (selectedChangeType && selectedChangeType.length > 0) {
                const { name, startDate, description } = _.first(selectedChangeType);
                var startDateMoment = moment(startDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
                form = {
                    changeType: name,
                    startDate: startDate,
                    description: description,
                    comments: ''
                }
                dateTime = {
                    startDate: startDateMoment
                };
                clear = false;
            }
            this.updateState({
                form: form,
                dateTime: dateTime,
                clear: clear,
                clearDate: false,
                error: false
            });
        }
    }

    render() {
        const { formError, saveChangeType } = this.props.adminData;
        const { dateTime } = this.state;
        const { mode } = this.props;
        let defaultStartDate = moment().subtract(1, 'days');
        let updatedStartDate = moment(this.state.dateTime.startDate).subtract(1, 'days');
        let startDateValid = function (current) {
            return current.isAfter(defaultStartDate);
        };
        return (<div className="row">
            <div className="col-md-12">
                <div className='row'>
                    <div className="col-md-4">
                        <div className="form-group">
                            <CategoryNameWrapper
                                name={'changeType'}
                                defaultValue={this.state.form.changeType}
                                onBlur={this.handleChangeTypeChange}
                                label='Name *'
                                error={formError.changeType}
                                errorMessage={formError.changeType}
                                clear={this.state.clear} />
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group">
                            <DatePicker onChange={val => { this.handleDateChange('startDate', val) }}
                                name={'startDate'} label={'As of Date *'} dateFormat={true} timeFormat={false}
                                required={true} defaultValue={this.state.dateTime.startDate}
                                isValidDate={startDateValid}
                                value={this.state.dateTime.startDate}
                                clear={this.state.clearDate}
                                dispConflicts="form-control"
                                minDate={new Date()}
                                autocomplete="off"
                                error={formError.startDate}
                                errorMessage={formError.startDate}
                                onDateError={(isError)=>{this.setState({dateError: isError })}} />
                            {this.state.error ?
                                 <div className="asOfDateCont">As of Date is greater than 30 days from current day. <br/>
                                <Button title="Save to Continue" className="btn request-btn"  onClick={(e) => { this.closeNotify() }} /> 
                                 </div> : ''}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className='col-md-12'>
                        <CountableTextArea
                            defaultValue={this.state.form.description}
                            onChange={this.handleInputChange}
                            label={'Description *'}
                            name={'description'}
                            required={true} limit={500}
                            error={formError.description}
                            errorMessage={formError.description}
                            clear={this.state.clear} />
                    </div>
                </div>
                <div className="row">
                    <div className='col-md-12'>
                        <CountableTextArea
                            defaultValue={this.state.form.comments}
                            onChange={this.handleInputChange}
                            label={(mode === 'edit') ? 'Comments *' : 'Comments'}
                            name={'comments'}
                            required={(mode === 'edit') ? true : false} limit={500}
                            error={formError.comments}
                            errorMessage={formError.comments}
                            clear={this.state.clear} />
                    </div>
                </div>
                <div className='row'>
                    <div className="col-md-12 col-lg-3">
                        <Button title="Save" className="btn request-btn" onClick={(mode === 'edit') ? this.saveEditChangeType : this.saveChangeType} />                        
                    </div>
                    <div className="col-md-12 col-lg-2">
                        <Button title="Cancel" className="btn clear-btn" onClick={this.cancel} />
                    </div>
                </div>

            </div>
        </div >);
    }
}
function mapStateToProps(state) {
    const { adminData } = state;
    return { adminData };
}
export default connect(mapStateToProps, actions)(withRouter(ChangeTypeModal));




