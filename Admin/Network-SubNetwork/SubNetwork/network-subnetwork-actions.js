import React, { useState } from 'react';
import Modal from "../../../../app/molecules/Modal";
import NetworkSubNetworkModal from './network-subnetwork-modal';
import AddImg from '../../../../app/layout/assets/add.svg';
import EditImg from '../../../../app/layout/assets/edit.svg';
import EditGrey from '../../../../app/layout/assets/Edit_grey.svg';

const NetworkSubnetworkActions = () => {
    const [disableActions, setDisableActions] = useState({
        edit: true,
        delete: true
    })
    const [mode, setMode] = useState('');
    const [showSubNetworkModal, setShowSubNetworkModal] = useState(false);
    const addEditSubNetwork = (event, mode) => {
        setMode(mode);
        setShowSubNetworkModal(true)
    }
    const toggleModal = () => {
        setMode('');
        setShowSubNetworkModal(!showSubNetworkModal);
    }
    return (
        <div className='float-right'>
            <div className="float-left">
                <h3 className={`float-left ml25` + (disableActions.edit ? ' icon-disable' : ' pointer')}>
                <img src={disableActions.edit ? EditGrey : EditImg} className='icon' style={{ height: 20 }} alt='Edit' id='edit' /> Edit</h3>
            </div>
            
            <div className="float-left">
                <h3 className='ml25  pointer' onClick={(e) => { addEditSubNetwork(e, 'create') }}>
                    <img src={AddImg} className='icon' style={{ height: 20 }} alt='Add' id='add' /> Add</h3>
            </div>
            <Modal
                show={showSubNetworkModal}
                onClose={() => toggleModal()}
                width={true}
                height={true}
                title={(mode === 'create') ? 'Add Sub-Network' : 'Edit NetworkSubNetwork'}
                children={<NetworkSubNetworkModal mode={mode} close={toggleModal} />}></Modal>
        </div >
    )
}

export default NetworkSubnetworkActions;