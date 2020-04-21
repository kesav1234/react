jest.mock('./approval-group-utilities');
import React from 'react';
import { ApprovalGroupModalTest } from './approval-group-modal';
import { ApprovalGroupUtilities } from './approval-group-utilities';
import { shallow } from 'enzyme';

const adomGroups = {
    1: 'Group1',
    2: 'Group2'
};

const networks = {
    1: {
        name: 'network1',
        subNetworks: {
            1: 'subNetwork1',
            2: 'subNetwork2'
        }
    }
};

const access = {
    user: {
        name: 'IQBALAM',
        displayName: 'Iqbal, Ammaar'
    }
};

test('Should render', async () => {
    const associations = await ApprovalGroupUtilities.getAssociations();
    const onClose = () => { /**/ };
    const onAdd = () => { /**/ };
    const wrapper = shallow(<ApprovalGroupModalTest
        access={access}
        networks={networks}
        adomGroups={adomGroups}
        associations={associations}
        show={true}
        onClose={onClose}
        onAdd={onAdd}
    />);
    await Promise.resolve();
    expect(wrapper).toBeTruthy();
});

test('Should add association', async () => {
    let ret = null;
    const associations = await ApprovalGroupUtilities.getAssociations();
    const onClose = () => { /**/ };
    const onAdd = a => { ret = a; };
    const wrapper = shallow(<ApprovalGroupModalTest
        access={access}
        networks={networks}
        adomGroups={adomGroups}
        associations={associations}
        show={true}
        onClose={onClose}
        onAdd={onAdd}
    />);
    await Promise.resolve();
    wrapper.instance().handleNetworkSelect(null, { key: '1', name: 'network1' });
    wrapper.instance().handleSubNetworkSelect([{ key: '1', name: 'subNetwork1' }]);
    wrapper.instance().handleAdomGroupSelect([{ key: '2', name: 'Group2' }]);
    await wrapper.instance().handleOnSave();
    expect(ret).toMatchObject([{
        networkId: '1',
        subNetworkId: '1',
        adomGroupName: '2',
        createdBy: 'IQBALAM',
        modifiedBy: 'IQBALAM',
        key: 0
    }]);
});

test('Should not allow duplicate association', async () => {
    const associations = await ApprovalGroupUtilities.getAssociations();
    const onClose = () => { /**/ };
    const onAdd = () => { /**/ };
    const wrapper = shallow(<ApprovalGroupModalTest
        access={access}
        networks={networks}
        adomGroups={adomGroups}
        associations={associations}
        show={true}
        onClose={onClose}
        onAdd={onAdd}
    />);
    await Promise.resolve();
    wrapper.instance().handleAdomGroupSelect([{ key: '1', name: 'Group1' }]);
    wrapper.instance().handleNetworkSelect(null, { key: '1', name: 'network1' });
    wrapper.instance().handleSubNetworkSelect([{ key: '1', name: 'subNetwork1' }]);
    await Promise.resolve();
    expect(wrapper.state('validation')).toMatchObject({ valid: false });
});

test('Should stop loading on add error', async () => {
    jest.resetModules();
    const associations = await ApprovalGroupUtilities.getAssociations();
    jest.doMock('./approval-group-utilities', () => ({
        ApprovalGroupUtilities: {
            addAssociations: () => Promise.reject()
        }
    }));
    const A = (await import('./approval-group-modal')).ApprovalGroupModalTest;
    const onClose = () => { /**/ };
    const onAdd = () => { /**/ };
    const wrapper = shallow(<A
        access={access}
        networks={networks}
        adomGroups={adomGroups}
        associations={associations}
        show={true}
        onClose={onClose}
        onAdd={onAdd}
    />);
    await Promise.resolve();
    await wrapper.instance().handleOnSave();
    expect(wrapper.state('loading')).toBe(false);
});

test('Should search ADOM groups', async () => {
    const associations = await ApprovalGroupUtilities.getAssociations();
    const onClose = () => { /**/ };
    const onAdd = () => { /**/ };
    const wrapper = shallow(<ApprovalGroupModalTest
        access={access}
        networks={networks}
        associations={associations}
        show={true}
        onClose={onClose}
        onAdd={onAdd}
    />);
    await Promise.resolve();
    wrapper.instance().handleAdomGroupSearch('test');
    await Promise.resolve();
    expect(wrapper.state('searchedAdomGroups')).toEqual(['Group13', 'Group24']);
    expect(wrapper).toBeTruthy();
});
