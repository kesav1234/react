import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from "moment/moment";
import * as actions from '../redux/actionCreators';
import CountableTextArea from '../../../app/molecules/CountableTextArea';
import Modal from "../../../app/molecules/Modal";

class Confirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: "",
            clear: true,
            formErrorMsg: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.revoke = this.revoke.bind(this);

    }


    clearComments() {
        this.setState({
            comments: "",
            clear: true,
            formErrorMsg: ''
        })
    }
    toggleModal = () => {
        let map = { condition: false, data: {} }
        this.clearComments()
        this.props.confirmRevoke(map);
        this.props.closeRevoke(true)


    }
    revoke() {

        if (this.state.comments.trim() != "") {
            let data = { ...this.props.confirmation.data, 'comment': this.state.comments }
            this.props.revoke(data);
            this.clearComments()
        } else {
            this.setState({ formErrorMsg: 'Please enter valid comments' })
        }

    }
    handleInputChange(e) {
        this.setState({ clear: false });
        var name = e.target.name;
        var value = e.target.value;
        this.setState({ comments: value });
    }

    render() {
        let show = (!_.isEmpty(this.props.confirmation)) ? this.props.confirmation.condition : false
        let displayUserList = this.props.confirmation.displayUser ? this.props.confirmation.displayUser.toString() : ''
        if (this.props.confirmation.revoke) {
            this.props.getAllUsers()
            let map = { condition: false, data: {}, revoke: false }
            this.props.confirmRevoke(map);
        }
        return (
            <div className="float-left">
                <Modal show={show}
                    onClose={this.toggleModal}
                    width={true}
                    title={`Confirmation`}
                    children={
                        <div>
                            {/* <div className="bold"> Are you sure you want to Revoke access for users.. </div> 
                                      <br/>
                                        <div className="bold"> {displayUserList} </div> */}
                            <br />
                            <CountableTextArea
                                onChange={this.handleInputChange}
                                defaultValue={this.state.comments}
                                id={'comments'}
                                label={'Comments *'}
                                name={'comments'} required={true} limit={500} onClick={this.handleInputChange}
                                error={this.state.formErrorMsg}
                                errorMessage={this.state.formErrorMsg}
                                clear={this.state.clear} />
                            <button type="button" className="btn btn-secondary btn-sm" onClick={this.revoke}>Yes</button>
                            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={this.toggleModal}>No</button>
                        </div>

                    } />
            </div>
        );
    }
}


function mapStateToProps(state) {

    return {
        confirmation: state.adminData.confirmRevoke

    };
}

export default connect(mapStateToProps, actions)(Confirmation);