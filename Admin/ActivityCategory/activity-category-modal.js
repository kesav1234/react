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
import { default as ValidateForm, ValidateItemExists, checkDate } from '../ValidateForm/validate-form';
import Modal from "../../../app/molecules/Modal";
import { decrypt, replaceUnWantedChars } from '../../../commonUtility';

class ActivityCategoryModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                activityCategory: '',
                startDate: '',
                description: '',
                comments: ''
            },
            dateTime: {
                startDate: null,
            },
            clear: false,
            error: false,
            activityCategoryError: '',
            startDateError: false,
            endDateError: false
        }
        this.setFormState = this.setFormState.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.saveActivityCategory = this.saveActivityCategory.bind(this);
        this.handleActivityCategoryChange = this.handleActivityCategoryChange.bind(this);
        this.setDateChange = this.setDateChange.bind(this);
        this.formValidate = this.formValidate.bind(this);
        this.saveEditActivityCategory = this.saveEditActivityCategory.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState !== this.state) {
            return true;
        } else if (!_.isEmpty(nextProps.adminData)) {
            const { selectedActivityCategory, formError, saveActivityCategory } = this.props.adminData;
            if (nextProps.adminData.selectedActivityCategory !== selectedActivityCategory) {
                return true;
            } else if (nextProps.adminData.formError !== formError) {
                return true;
            } else if (nextProps.adminData.saveActivityCategory !== saveActivityCategory) {
                const { code } = nextProps.adminData.saveActivityCategory;
                if (code === 201 || code === 200) {
                    this.props.getAllActivityCategory();
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
            activityCategoryError: propertyValue['activityCategoryError']
        }));
    }

    componentDidUpdate(prevProps, prevState) {
        const { mode } = this.props;
        const { selectedActivityCategory } = this.props.adminData;
        var form = {
            activityCategory: '',
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
                activityCategoryError: ''
            });
        } else if ((mode === 'edit' || mode === '') && prevProps.adminData.selectedActivityCategory !== selectedActivityCategory) {
            var clear = true;
            if (selectedActivityCategory && selectedActivityCategory.length > 0) {
                const { name, startDate, description } = _.first(selectedActivityCategory);
                var startDateMoment = moment(startDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
                form = {
                    activityCategory: name,
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
                error: false,
                activityCategoryError: ''
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
    }

    setFormState(name, value) {
        this.setState(prevState => ({
            form: {
                ...prevState.form, [name]: value
            }
        }));
    }

    setDateChange = (name, value) => {
        let errorName = name+"Error";
        this.setState({ clear: false, [errorName]:false });
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

    handleActivityCategoryChange(e) {
        this.setState({ clear: false });
        const { activeCategory } = this.props.adminData;
        var name = e.target.name;
        var value = e.target.value;
        var result = ValidateItemExists('Activity Category', activeCategory, 'name', value);
        if (this.props.mode === 'edit') {
            let selected = _.first(this.props.adminData.selectedActivityCategory);
            if (value === selected['name']) {
                result = false;
            }
        }
        if (result) {
            this.props.formErrors({ [name]: result });
            this.setState({ activityCategoryError: result });
        } else {
            this.props.formErrors('', name);
            this.setState({ activityCategoryError: null });
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

    saveActivityCategory() {
        const { formError } = this.props.adminData;
        if (this.formValidate() && !this.state.activityCategoryError && !this.state.startDateError && !this.state.endDateError) {
            const { activeCategory } = this.props.adminData;
            var cloneForm = _.clone(this.state.form);
            var paylaod = [];
            var result = _.maxBy(activeCategory, (item) => { return item.id; });
            var id = (result) ? (Number(result.id) + 1) : 1;
            paylaod.push({
                "id": (id ? id : 1),
                "name": cloneForm.activityCategory,
                "description": cloneForm.description,
                "startDate": cloneForm.startDate,
                "createdBy": this.state.vzid,
                "modifiedBy": this.state.vzid
            });
            this.props.saveActivityCategory(paylaod);
        }
    }

    saveEditActivityCategory() {
        const { formError } = this.props.adminData;
        if (this.formValidate() && !this.state.activityCategoryError && !this.state.startDateError && !this.state.endDateError) {
            var cloneForm = _.clone(this.state.form);
            var cloneActivity = _.clone(this.props.adminData.selectedActivityCategory[0]);
            cloneForm.modifiedBy = this.state.vzid;
            cloneForm.name = cloneForm.activityCategory;
            var payload = _.assign({},
                _.pick(cloneForm, ['name', 'startDate', 'description', 'comments', 'modifiedBy']),
                _.pick(cloneActivity, ['id', 'createdBy']));
            this.props.editActivityCategory(cloneActivity.key, payload);
        }
    }

    cancel() {        
        const { close } = this.props;
        close();
    }

    render() {
        const { formError, saveActivityCategory } = this.props.adminData;
        const { dateTime, activityCategoryError } = this.state;
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
                                name={'activityCategory'}
                                defaultValue={this.state.form.activityCategory}
                                onBlur={this.handleActivityCategoryChange}
                                label='Name *'
                                error={formError.activityCategory || activityCategoryError}
                                errorMessage={formError.activityCategory || activityCategoryError}
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
                                clear={this.state.clear}
                                dispConflicts="form-control"
                                minDate={new Date()}
                                autocomplete="off"
                                error={formError.startDate}
                                errorMessage={formError.startDate}
                                onDateError={(isError)=>{this.setState({startDateError: isError })}} />
                            {this.state.error ?
                                <span style={{ color: '#ED7000' }}>As of Date is greater than 30 days from current day. Are you sure you want to proceed ? </span> : ''}
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
                        <Button title="Save" className="btn request-btn" onClick={(mode === 'edit') ? this.saveEditActivityCategory : this.saveActivityCategory} />
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
export default connect(mapStateToProps, actions)(withRouter(ActivityCategoryModal));