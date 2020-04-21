import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from "moment/moment";
import * as actions from '../../redux/actionCreators';
import AddImg from '../../../../app/layout/assets/add.svg';
import Modal from "../../../../app/molecules/Modal";
import AddActivityTypeModal from './add-activity-type-modal';
import ActivityTypeHistoryLog from '../ActivityTypeHistoryLog';

class AddActivityType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCategoryModal: false
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.addCategory = this.addCategory.bind(this);
    }

    addCategory() {
        this.setState({ showCategoryModal: true });
    }

    toggleModal() {
        if(!this.props.toggleViewHistoryActivityTypeModal){
            this.props.showActivityType(false);
        }else{
            this.props.showViewHistory();
        }
        this.props.formErrors({});
        let map={'add':false, 'editData':[], 'edit':false}
        this.props.addEditActivityType(map)
 
    }

    render() {
            const {toggleViewHistoryActivityTypeModal,activityTypeHistortAvailable}=this.props;
  
            let addEdit= this.props.addEdit
            let edit = !_.isEmpty(addEdit) ? addEdit["edit"] : false
            let editData = !_.isEmpty(addEdit) ? 
                        addEdit["edit"] ? addEdit["editData"] :[]
                        : []

            if(this.props.completed){
              this.props.getAdminValues();
              this.props.getAllActivityCategory();
              this.props.getAllActivityType(); 
              this.props.showActivityType(false);
              this.props.completedActivityType(false);
            } 

        return (
            <div className="float-left">
            
                <Modal
                    show={toggleViewHistoryActivityTypeModal ?true:this.props.show}
                    onClose={() => this.toggleModal()}
                    width={true}
                    sectionWidth={toggleViewHistoryActivityTypeModal?'80vw':null}
                    height={true}
                    title={activityTypeHistortAvailable?'Activity Type History Log':edit  ? 'Edit Activity Type' : 'Add Activity Type'}
                    children={toggleViewHistoryActivityTypeModal?<ActivityTypeHistoryLog/>:<AddActivityTypeModal 
                    data={editData}
                    type={edit ? 'Edit' : 'Add'}
                    close={this.toggleModal} />}></Modal>
            </div>
        );
    }
}
function mapStateToProps(state) {
 

    return {
        addEdit: state.adminData.addEditActivityData,
        show:state.adminData.showEditActivityType,
        completed: state.adminData.completedActivityType,
        activityTypeHistoryLog: state.adminData.activityTypeHistoryLog,
        activityTypeHistortAvailable: state.adminData.activityTypeHistortAvailable,
        toggleViewHistoryActivityTypeModal: state.adminData.toggleViewHistoryActivityTypeModal
       
    };
}

export default connect(mapStateToProps, actions)(withRouter(AddActivityType));