import React, { Component } from 'react';
import { connect } from 'react-redux'
import Loader from '../../../app/atoms/Loader'


class RevokeAccessLoader extends Component { 

    constructor(props){
        super(props)
    }


    render(){

        return(
            <div>
              {(this.props.loader) ? <Loader /> : ''}
            </div>
        )
    }

}

function mapStateToProps(state) {
    
    return {
        loader:state.adminData.revokeLoader
       
    };
}

export default connect(mapStateToProps, null)(RevokeAccessLoader) 