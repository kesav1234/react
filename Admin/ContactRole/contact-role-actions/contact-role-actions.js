import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from "moment/moment";
import * as actions from '../../redux/actionCreators';
import Modal from "../../../../app/molecules/Modal";
import ContactRoleModal from '../contact-role-modal';
import AddImg from '../../../../app/layout/assets/add.svg';
import EditImg from '../../../../app/layout/assets/edit.svg';
import CloseImg from '../../../../app/layout/assets/remove-item.svg';
import EditGrey from '../../../../app/layout/assets/Edit_grey.svg';
import cancelFreezegrey from '../../../../app/layout/assets/cancelchangeFreeze_grey.svg';
import cancelBlack from '../../../../app/layout/assets/Cancel_black.svg';
import cancelWhite from '../../../../app/layout/assets/cancel_white.svg';
import { decrypt, replaceUnWantedChars } from '../../../../commonUtility';

class ContactRoleActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showContactRoleModal: false,
            mode: '',
            disableActions: {
                edit: true,
                delete: true,
                expire: true
            },
        }
        this.addEditContactRole = this.addEditContactRole.bind(this);
        this.enableDisableActions = this.enableDisableActions.bind(this);
        this.resetActions = this.resetActions.bind(this);
        this.deleteRole = this.deleteRole.bind(this);
        this.expireRole = this.expireRole.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
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

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState !== this.state) {
            return true;
        } else if (nextProps.selectedContactRole !== this.props.selectedContactRole) {
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectedContactRole !== this.props.selectedContactRole) {
            this.enableDisableActions(this.props.selectedContactRole)
        }
    }

    addEditContactRole(event, mode) {
        this.setState({
            showContactRoleModal: true,
            mode: mode
        }, () => {
            this.props.setSelectedContactRole(this.props.selectedContactRole);
        });
    }

    resetActions(value) {
        this.setState(prevState => ({
            ...prevState,
            disableActions: {
                edit: value,
                delete: value,
                expire: value
            }
        }));
    }

    enableDisableActions(selectedContactRole) {
       this.resetActions(true);
        if (selectedContactRole.length > 0) {
            if (selectedContactRole.length === 1) {
                    this.setState(prevState => ({
                    ...prevState,
                    disableActions: {
                        edit: false,
                        delete: false,
                        expire: _.filter(selectedContactRole, function(o){ return o.status === 'In Active'}).length>0
                    }
                    }))
            }
            else        
            this.setState(prevState => ({
            ...prevState,
            disableActions: {
                edit: true,
                delete: false,
                expire: _.filter(selectedContactRole, function(o){ return o.status === 'In Active'}).length>0
            }
            }));
        }
    }

    deleteRole(){
        const { selectedContactRole } = this.props;
        this.props.setDeleteOrExpire('delete');
        let result = selectedContactRole.map(a => a.contactsId);
        var payload = {
            "contactsIds":result,
            "modifiedBy": this.state.vzid
        }
        this.props.deleteRole(payload);
    }

    expireRole(){
        const { selectedContactRole } = this.props;
        this.props.setDeleteOrExpire('expire');
        let result = selectedContactRole.map(a => a.contactsId);
        var payload = {
            "contactsIds":result,
            "endDate": moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
            "modifiedBy": this.state.vzid
        }
        this.props.expireRole(payload);
    }

    toggleModal() {
        this.props.clearSaveContactRole();
        this.props.formErrors({});
        this.props.resetSelectedContactRole(true);
        this.setState({
            showContactRoleModal: !this.state.showContactRoleModal,
            mode: ''
        });
    }

    render() {
        const { disableActions } = this.state;
        return (
            <div className='float-right'>
                <div className="float-left">
                    <h3 className='ml25  pointer' onClick={(e) => { this.addEditContactRole(e, 'create') } }>
                        <img src={AddImg} className='icon' style={{ height: 20 }} alt='Add' id='add' /> Add</h3>
                </div>
                <div className="float-left">
                    <h3 className={`float-left ml25` + (disableActions.edit ? ' icon-disable' : ' pointer')} onClick={(e) => { ((disableActions.edit) ? '' : this.addEditContactRole(e, 'edit')) } }>
                        <img src={disableActions.edit ? EditGrey : EditImg} className='icon' style={{ height: 20 }} alt='Edit' id='edit' /> Edit</h3>
                </div>
                <div className="float-left">
                    <h3 className={`float-left ml25` + (disableActions.expire ? ' icon-disable' : ' pointer')} onClick={(e) => { (disableActions.expire) ? '' : this.expireRole() } }>
                        <img src={disableActions.expire ? cancelFreezegrey : cancelBlack} className='icon' style={{ height: 20 }} alt='Expire' id='expire' />Expire</h3>
                </div>
                <h3 className={`float-left ml25` + (disableActions.delete ? ' icon-disable' : ' pointer')} onClick={(e) => { (disableActions.delete) ? '' : this.deleteRole() } }>
                    <img src={CloseImg} className='icon' style={{ height: 20 }} alt='Delete' /> Remove</h3>
                <Modal
                    show={this.state.showContactRoleModal}
                    onClose={() => this.toggleModal()}
                    width={false}
                    title={(this.state.mode === 'create') ? 'Add Contact Role' : this.state.mode === 'edit' ? 'Edit Contact Role' : 'Expire Contact Role'}
                    children={<ContactRoleModal mode={this.state.mode} close={this.toggleModal} />}></Modal>
            </div >);
    }
}
function mapStateToProps(state) {
    const { adminData } = state;
    return { adminData };
}
export default connect(mapStateToProps, actions)(withRouter(ContactRoleActions));