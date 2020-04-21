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
import CustomSelect from '../../../app/molecules/CustomSelect';
import Button from "../../../app/atoms/Button/Button";
import { default as ValidateForm, ValidateItemExists, checkDate } from '../ValidateForm/validate-form';
import Modal from "../../../app/molecules/Modal";
import { decrypt, replaceUnWantedChars } from '../../../commonUtility';

class ApplicationServiceProviderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                applicationName: '',
                type: undefined,
                startDate: '',
                description: '',
                comments: ''
            },
            dateTime: {
                startDate: null,
            },
            clear: false,
            error: false,
            nameError: false
        }
        this.setFormState = this.setFormState.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.saveASP = this.saveASP.bind(this);
        this.handleASPChange = this.handleASPChange.bind(this);
        this.setDateChange = this.setDateChange.bind(this);
        this.formValidate = this.formValidate.bind(this);
        this.saveEditASP = this.saveEditASP.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.toggleOptions = this.toggleOptions.bind(this);
    }

    toggleOptions(name) {
        // this.setState({ currentComponent: name });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState !== this.state) {
            return true;
        } else if (!_.isEmpty(nextProps.adminData)) {
            const { selectedASP, formError, saveASP } = this.props.adminData;
            if (nextProps.adminData.selectedASP !== selectedASP) {
                return true;
            } else if (nextProps.adminData.formError !== formError) {
                return true;
            } else if (nextProps.adminData.saveASP !== saveASP) {
                const { code } = nextProps.adminData.saveASP;
                if (code === 201 || code === 200) {
                    this.props.getAllApplicationServiceProvider();
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
            error: propertyValue['error'],
            nameError: propertyValue['nameError']
        }));
    }

    componentDidUpdate(prevProps, prevState) {
        const { mode } = this.props;
        const { selectedASP } = this.props.adminData;
        var form = {
            applicationName: '',
            type: undefined,
            startDate: '',
            description: '',
            comments: ''
        };
        var dateTime = {
            startDate: ''
        };
        if (mode === 'create' && prevProps.mode !== this.props.mode) {
            this.updateState({
                form: form,
                dateTime: dateTime,
                clear: true,
                error: false,
                nameError: false
            });
        } else if ((mode === 'edit' || mode === '') && prevProps.adminData.selectedASP !== selectedASP) {
            var clear = true;
            if (selectedASP && selectedASP.length > 0) {
                const { name, startDate, description, serviceProviderType } = _.first(selectedASP);
                form = {
                    applicationName: name,
                    type: serviceProviderType ? serviceProviderType.key : undefined,
                    startDate: startDate,
                    description: description,
                    comments: ''
                }
                dateTime = {
                    startDate: startDate
                };
                clear = false;
            }
            this.updateState({
                form: form,
                dateTime: dateTime,
                clear: clear,
                error: false,
                nameError: false
            });
        }

    }

    componentWillMount() {
        const values = replaceUnWantedChars(this.props.location.search);
        var decryptedValues = decrypt(values);
        if (decryptedValues) {
            this.setState({
                vzid: decryptedValues
            });
        }
        this.props.getServiceProviderList();
    }

    setFormState(name, value) {
        this.setState(prevState => ({
            form: {
                ...prevState.form, [name]: value
            }
        }));
    }

    setDateChange = (name, value) => {
        let errorName = name + "Error";
        this.setState({ clear: false, [errorName]: false });
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

    handleASPChange(e) {
        this.setState({ clear: false });
        const { asp } = this.props.adminData;
        var name = e.target.name;
        var value = e.target.value;
        var result = ValidateItemExists('Application Service Provider', asp, 'name', value);
        if (this.props.mode === 'edit') {
            let selected = _.first(this.props.adminData.selectedASP);
            if (value === selected['name']) {
                result = false;
            }
        }
        this.setState({ nameError: result });
        if (result) {
            this.props.formErrors({ [name]: this.state.nameError });
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

    handleSelectChange(e, obj) {
        this.setState({ clear: false });
        const { formError } = this.props.adminData;
        let updatedKey = e.target.name;
        let updatedValue = obj ? obj.key : undefined;
        if (obj && !obj.key)
            return;
        if (updatedValue && formError[updatedKey]) {
            this.props.formErrors('', updatedKey);
        }
        this.setFormState(updatedKey, updatedValue);
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

    saveASP() {
        const { formError, asp } = this.props.adminData;
        if (this.formValidate() && !this.state.nameError) {
            var cloneForm = _.clone(this.state.form);
            var result = _.maxBy(asp, (item) => { return item.id; });
            var id = (result) ? (Number(result.key) + 1) : 1;
            var payload = {
                "id": id,
                "name": cloneForm.applicationName,
                "serviceProviderTypeId": cloneForm.type,
                "description": cloneForm.description,
                "startDate": moment(this.state.dateTime.startDate).format('YYYY-MM-DDTHH:mm:ss'),
                "createdBy": this.state.vzid,
                "modifiedBy": this.state.vzid
            };
            this.props.saveApplicationServiceProvider(payload);
        }
    }

    saveEditASP() {
        const { formError } = this.props.adminData;
        if (this.formValidate() && !this.state.nameError) {
            var cloneForm = _.clone(this.state.form);
            var cloneASP = _.clone(this.props.adminData.selectedASP[0]);
            cloneForm.modifiedBy = this.state.vzid;
            var payload = {
                "key": cloneASP.key,//
                "id": cloneASP.id,//
                "serviceProviderTypeId": cloneForm.type, //
                "name": cloneForm.applicationName,
                "description": cloneForm.description,//
                "startDate": moment(this.state.dateTime.startDate).format('YYYY-MM-DDTHH:mm:ss'),//
                "modifiedBy": this.state.vzid,//
                "createdBy": this.state.vzid,
                "comments": cloneForm.comments//
            };
            this.props.editASP(payload);
        }
    }

    cancel() {
        const { close } = this.props;
        close();
    }

    render() {
        const { formError, saveASP, serviceProvider } = this.props.adminData;
        const { dateTime } = this.state;
        const { mode } = this.props;
        console.log("this.state:::::::::::", this.state)
        let defaultStartDate = moment().subtract(1, 'days');
        let updatedStartDate = moment(this.state.dateTime.startDate).subtract(1, 'days');
        let startDateValid = function (current) {
            return current.isAfter(defaultStartDate);
        };
        let endDateValid = function (current) {
            return current.isAfter(defaultStartDate);
        };

        return (<div className="row">
            <div className="col-md-12">
                <div className='row'>
                    <div className="col-md-4">
                        <div className="form-group">
                            <CategoryNameWrapper
                                name={'applicationName'}
                                defaultValue={this.state.form.applicationName}
                                onBlur={this.handleASPChange}
                                label='Name *'
                                error={this.state.nameError || formError.applicationName}
                                errorMessage={this.state.nameError || formError.applicationName}
                                clear={this.state.clear} />
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group">
                            <DatePicker onChange={val => { this.handleDateChange('startDate', val) } }
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
                                onDateError={(isError) => { this.setState({ startDateError: isError }) } } />
                            {this.state.error ?
                                <span style={{ color: '#ED7000' }}>As of Date is greater than 30 days from current day. Are you sure you want to proceed ? </span> : ''}
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-4'>
                        <div className="need-validated">
                            <CustomSelect
                                name={'type'}
                                // value={ActivityType}
                                defaultValue={this.state.form.type}
                                defaultOptionIndex={this.state.form.type}
                                label={'Service Provider Type*'}
                                disabled={false}
                                required={true}
                                options={serviceProvider}
                                onChange={this.handleSelectChange}
                                tabIndex="0"
                                currentComponent={this.state.currentComponent}
                                toggleOptions={this.toggleOptions}
                                error={formError.type}
                                errorMessage={formError.type}
                                clear={this.state.clear}
                                />
                        </div>
                    </div>
                </div>
                <br />
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
                {(mode === 'edit') ?
                    <div className="row">
                        <div className='col-md-12'>
                            <CountableTextArea
                                defaultValue={this.state.form.comments}
                                onChange={this.handleInputChange}
                                label={'Comments *'}
                                name={'comments'}
                                required={true} limit={500}
                                error={formError.comments}
                                errorMessage={formError.comments}
                                clear={this.state.clear} />
                        </div>
                    </div>
                    : ''}
                <div className='row'>
                    <div className="col-md-12 col-lg-3">
                        <Button title="Save" className="btn request-btn" onClick={(mode === 'edit') ? this.saveEditASP : this.saveASP} />
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
export default connect(mapStateToProps, actions)(withRouter(ApplicationServiceProviderModal));