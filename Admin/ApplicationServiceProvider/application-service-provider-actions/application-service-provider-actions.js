import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from "moment/moment";
import * as actions from '../../redux/actionCreators';
import Modal from "../../../../app/molecules/Modal";
import ApplicationServiceProviderModal from '../application-service-provider-modal';
import AddImg from '../../../../app/layout/assets/add.svg';
import EditImg from '../../../../app/layout/assets/edit.svg';
import CloseImg from '../../../../app/layout/assets/remove-item.svg';
import EditGrey from '../../../../app/layout/assets/Edit_grey.svg';

class ApplicationServiceProviderActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showASPModal: false,
            mode: '',
            disableActions: {
                edit: true,
                delete: true
            },
        }
        this.addEditASP = this.addEditASP.bind(this);
        this.enableDisableActions = this.enableDisableActions.bind(this);
        this.resetActions = this.resetActions.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState !== this.state) {
            return true;
        } else if (nextProps.selectedASP !== this.props.selectedASP) {
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectedASP !== this.props.selectedASP) {
            this.enableDisableActions(this.props.selectedASP)
        }
    }

    addEditASP(event, mode) {
        this.setState({
            showASPModal: true,
            mode: mode
        }, () => {
            this.props.setSelectedApplicationServiceProvider(this.props.selectedASP);
        });
    }

    resetActions(value) {
        this.setState(prevState => ({
            ...prevState,
            disableActions: {
                edit: value,
                delete: value
            }
        }));
    }

    enableDisableActions(selectedASP) {
        this.resetActions(true);
        if (selectedASP.length > 0) {
            if (selectedASP.length === 1) {
                this.resetActions(false);
            } 
        }
    }

    toggleModal() {
        this.props.clearSaveApplicationServiceProvider();
        this.props.formErrors({});
        this.props.resetSelectedApplicationServiceProvider(true);
        this.setState({
            showASPModal: !this.state.showASPModal,
            mode: ''
        });
    }

    render() {
        const { disableActions } = this.state;
        return (
            <div className='float-right'>
                <div className="float-left">
                    <h3 className={`float-left ml25` + (disableActions.edit ? ' icon-disable' : ' pointer')} onClick={(e) => { ((disableActions.edit) ? '' : this.addEditASP(e, 'edit')) }}>
                        <img src={disableActions.edit ? EditGrey : EditImg} className='icon' style={{ height: 20 }} alt='Edit' id='edit' /> Edit</h3>
                </div>
                {/* 
                    GTSO-3221 - feature enhancement
                <h3 className={`float-left ml25` + (disableActions.delete ? ' icon-disable' : ' pointer')}>
                    <img src={CloseImg} className='icon' style={{ height: 20 }} alt='Delete' /> Delete</h3> */}
                <div className="float-left">
                    <h3 className='ml25  pointer' onClick={(e) => { this.addEditASP(e, 'create') }}>
                        <img src={AddImg} className='icon' style={{ height: 20 }} alt='Add' id='add' /> Add</h3>
                </div>
                <Modal
                    show={this.state.showASPModal}
                    onClose={() => this.toggleModal()}
                    width={false}
                    title={(this.state.mode === 'create') ? 'Add Service Provider' : 'Edit Service Provider'}
                    children={<ApplicationServiceProviderModal mode={this.state.mode} close={this.toggleModal} />}></Modal>
            </div >);
    }
}
function mapStateToProps(state) {
    const { adminData } = state;
    return { adminData };
}
export default connect(mapStateToProps, actions)(withRouter(ApplicationServiceProviderActions));