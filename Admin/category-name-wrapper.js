import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './redux/actionCreators';
import { withRouter } from 'react-router-dom';

class CategoryNameWrapper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            val: props.value || props.defaultValue || ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            this.setState({ val: nextProps.value })
        }
        if (nextProps.defaultValue) {
            this.setState({ val: nextProps.defaultValue });
        }
        if (nextProps.clear) {
            this.setState({ val: '' })
        }
    }

    handleOnChange(e) {
        const { val } = this.state;
        this.setState({ val: e.target.value });
        this.props.onChange && this.props.onChange(e)
    }

    render() {
        const { name, defaultValue, onBlur, label, error, errorMessage } = this.props;
        const { val } = this.state;
        return (
            <div className="form-group" >
                <div className={`${error ? 'in-validated ' : 'need-validated '}`}>
                    <input name={name} className="form-control" type="text"
                        required onBlur={onBlur} value={val} onChange={(e) => { this.handleOnChange(e) }} />
                    <label className="form-control-placeholder" htmlFor={name}>{label}</label>
                    {error ? <div className='invalid-feedback'>{errorMessage}</div> : ''}
                </div>
            </div>);
    }
}
export default connect(null, actions)(withRouter(CategoryNameWrapper));