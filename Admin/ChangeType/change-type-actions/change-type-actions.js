import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from "moment/moment";
import * as actions from '../../redux/actionCreators';
import Modal from "../../../../app/molecules/Modal";
import ChangeTypeModal from '../change-type-modal';
import AddImg from '../../../../app/layout/assets/add.svg';
import EditImg from '../../../../app/layout/assets/edit.svg';
import CloseImg from '../../../../app/layout/assets/remove-item.svg';
import EditGrey from '../../../../app/layout/assets/Edit_grey.svg';
import HistoryImg from '../../../../app/layout/assets/history.svg';
import ClockImg from '../../../../app/layout/assets/Clock.svg';
import ChangeTypeHistoryLog from '../ChangeTypeHistoryLog';
class ChangeTypeActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showChangeTypeModal: false,
            arrayOfChangeTypeId:[],
            mode: '',
            disableActions: {
                edit: true,
                delete: true
            },
        }
        this.addEditType = this.addEditType.bind(this);
        this.enableDisableActions = this.enableDisableActions.bind(this);
        this.resetActions = this.resetActions.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleViewHistory = this.handleViewHistory.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState !== this.state) {
            return true;
        } else if (nextProps.selectedCategory !== this.props.selectedCategory) {
            return true;
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectedCategory !== this.props.selectedCategory) {
            this.enableDisableActions(this.props.selectedCategory)
        }
    }

    addEditType(event, mode) {
        this.setState({
            showChangeTypeModal: true,
            mode: mode
        }, () => {
            this.props.setSelectedChangeType(this.props.selectedCategory);
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

    enableDisableActions(selectedCategory) {
        this.resetActions(true);
        if (selectedCategory.length > 0) {
            if (selectedCategory.length === 1) {
                this.resetActions(false);
            } else {
                this.state.disableActions.delete = false;
            }
        }
    }

    /* MSJVA 732 */

    handleViewHistory = (e) =>{
        e.preventDefault();
        e.stopPropagation();
        const {selectedCategory} = this.props;
        let arrayOfChangeTypeId = [];
        if(selectedCategory){
            arrayOfChangeTypeId = selectedCategory.map(category=>{return category.id})
        }
        this.setState({arrayOfChangeTypeId})
        this.props.viewHistoryOfChangeType(arrayOfChangeTypeId);
    }

    toggleModal() {
        if(this.props.toggleViewHistoryChangeTypeModal){
            this.props.showCategoryTypeHistory();
        }else{
            this.setState({ showChangeTypeModal: !this.state.showChangeTypeModal,mode:'' });
        }
        this.props.resetSelectedChangeType(true);     
        this.props.formErrors({});
        this.props.clearSaveChangeType();
    }

    render() {
        const { disableActions } = this.state;
        console.log(this.props.toggleViewHistoryChangeTypeModal,'this.props.toggleViewHistoryChangeTypeModal',this.props.changeTypeHistoryAvailable)
        return (
            <div className='float-right'>
                <div className="float-left">
                    <h3 className={`float-left ml25` + (disableActions.edit ? ' icon-disable' : ' pointer')} onClick={(e) => { ((disableActions.edit) ? '' : this.addEditType(e, 'edit')) }}>
                        <img src={disableActions.edit?EditGrey:EditImg} className='icon' style={{ height: 20 }} alt='Edit' id='edit' /> Edit</h3>
                </div>
                {/* GTSO-3221 - feature enhancement
                <h3 className={`float-left ml25` + (disableActions.delete ? ' icon-disable' : ' pointer')}>
                    <img src={CloseImg} className='icon' style={{ height: 20 }} alt='Delete' /> Delete</h3> */}
                <div className="float-left">
                    <h3 className='ml25  pointer' onClick={(e) => { this.addEditType(e, 'create') }}>
                        <img src={AddImg} className='icon' style={{ height: 20 }} alt='Add' id='add' /> Add</h3>
                </div> 
                <div className="float-left">
                    <h3 className={`float-left ml25` + (this.props.selectedCategory <1? ' icon-disable' : ' pointer')} onClick={this.props.selectedCategory <1?'':this.handleViewHistory}>
                        <img src={this.props.selectedCategory <1?ClockImg:HistoryImg} className='icon' style={{ height: 20 }} alt='View history' id='viewhistory' /> View History
                    </h3>
                </div> 
                <Modal
                    show={this.props.toggleViewHistoryChangeTypeModal?true:this.state.showChangeTypeModal}
                    sectionWidth={this.props.toggleViewHistoryChangeTypeModal?'80vw':null}
                    onClose={() => this.toggleModal()}
                    height={true}
                    width={false}
                    title={this.props.toggleViewHistoryChangeTypeModal?'Change Type History Log':(this.state.mode === 'create') ? 'Add Change Type' : 'Edit Change Type'}
                    children={this.props.toggleViewHistoryChangeTypeModal?<ChangeTypeHistoryLog/>:<ChangeTypeModal mode={this.state.mode} close={this.toggleModal} />}></Modal>
            </div >);
    }
}
function mapStateToProps(state) {
    const {changeTypeHistoryLog,changeTypeHistoryAvailable,toggleViewHistoryChangeTypeModal} = state.adminData
    return { 
        changeTypeHistoryLog,
        changeTypeHistoryAvailable,
        toggleViewHistoryChangeTypeModal
    };
}
export default connect(mapStateToProps, actions)(withRouter(ChangeTypeActions));