jest.mock('./approval-group-utilities.js');
import React from 'react';
import { shallow } from 'enzyme';
import { ApprovalGroupTest } from './approval-group';
import { ApprovalGroupModal } from './approval-group-modal';

const access = {
    user: {
        name: 'IQBALAM',
        displayName: 'Iqbal, Ammaar'
    }
};

test('Should component render', async () => {
    shallow(<ApprovalGroupTest access={access} />);
});

test('Should display title', () => {
    const wrapper = shallow(<ApprovalGroupTest access={access} />);
    const titleText = wrapper.find('h2.mt10.bold').first().text();
    expect(titleText).toEqual('Approval Group Management');
});

test('Should display buttons', () => {
    const wrapper = shallow(<ApprovalGroupTest access={access} />);
    const buttons = wrapper.find('h3.float-left.ml25');
    const addButtonText = buttons.at(0).text().trim();
    const removeButtonText = buttons.at(1).text().trim();
    expect(addButtonText).toEqual('Add');
    expect(removeButtonText).toEqual('Remove');
});

test('Should have modal closed at start', () => {
    const wrapper = shallow(<ApprovalGroupTest access={access} />);
    const { showModal } = wrapper.state();
    expect(showModal).toBe(false);
    expect(wrapper.find(ApprovalGroupModal).length).toBe(0);
});

test('Should open add modal', async () => {
    const wrapper = shallow(<ApprovalGroupTest access={access} />);
    await Promise.resolve();
    await wrapper.instance().toggleModal();
    expect(wrapper.state('showModal')).toBe(true);
    expect(wrapper.find(ApprovalGroupModal).length).toBe(1);
});

test('Should de/select all associations', async () => {
    const wrapper = shallow(<ApprovalGroupTest access={access} />);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(wrapper.state('selectedAssociations').size).toBe(0);
    const numAssociations = wrapper.state('associations').length;
    wrapper.instance().handleSelectAllCheckboxClick({ target: { checked: true } });
    await Promise.resolve();
    expect(wrapper.state('selectedAssociations').size).toBe(numAssociations);
    wrapper.instance().handleSelectAllCheckboxClick({ target: { checked: false } });
    await Promise.resolve();
    expect(wrapper.state('selectedAssociations').size).toBe(0);
});

test('Should have columns with proper headers', async () => {
    const wrapper = shallow(<ApprovalGroupTest access={access} />);
    const columns = wrapper.instance().getTableColumns();
    const columnNames = columns.map(c => c.Header().props.children[0]);
    expect(columnNames.slice(1)).toEqual([
        'Network/Sub-Network',
        'ADOM Group',
        'Created Date/Time',
        'Created By'
    ]);
    const indexes = columns.slice(1).map((c, i) => {
        const filter = null;
        let ret = -1;
        const onChange = val => { ret = val; };
        const f = c.Filter({ filter, onChange });
        const input = f.props.children[0];
        input.props.onChange({ target: { value: i } });
        return ret;
    });
    expect(indexes).toEqual([0, 1, 2, 3]);
});

test('Should de/select associations', async () => {
    const wrapper = shallow(<ApprovalGroupTest access={access} />);
    await Promise.resolve();
    expect(wrapper.state('selectedAssociations').size).toBe(0);
    wrapper.instance().handleCheckboxClick({ target: { value: 2, checked: true } });
    await Promise.resolve();
    expect(wrapper.state('selectedAssociations').size).toBe(1);
    expect(wrapper.state('selectedAssociations').has(2)).toBe(true);
    wrapper.instance().handleCheckboxClick({ target: { value: 1, checked: true } });
    await Promise.resolve();
    expect(wrapper.state('selectedAssociations').size).toBe(2);
    expect(wrapper.state('selectedAssociations').has(1)).toBe(true);
    expect(wrapper.state('selectedAssociations').has(2)).toBe(true);
    wrapper.instance().handleCheckboxClick({ target: { value: 2, checked: false } });
    await Promise.resolve();
    expect(wrapper.state('selectedAssociations').size).toBe(1);
    expect(wrapper.state('selectedAssociations').has(1)).toBe(true);
    expect(wrapper.state('selectedAssociations').has(2)).toBe(false);
    wrapper.instance().handleCheckboxClick({ target: { value: 1, checked: false } });
    await Promise.resolve();
    expect(wrapper.state('selectedAssociations').size).toBe(0);
});

test('Should get networks when toggling modal', async () => {
    const wrapper = shallow(<ApprovalGroupTest access={access} />);
    await Promise.resolve();
    wrapper.setState({ networks: {} });
    await wrapper.instance().toggleModal();
    expect(wrapper.state('networks')).toEqual({
        '1': {
            name: 'network1',
            subNetworks: { '1': 'subNetwork1', '2': 'subNetwork2' }
        }
    });
});

test('Should add association', async () => {
    const wrapper = shallow(<ApprovalGroupTest access={access} />);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    const association = {
        key: 13,
        adomGroupName: '2',
        createdTimestamp: 1586224305454,
        networkId: 1,
        subNetworkId: 1,
        createdBy: 'IQBALAM'
    };
    wrapper.instance().handleOnAdd([association]);
    await Promise.resolve();
    expect(wrapper.state('associations')[2]).toEqual(association);
});

test('Should delete association', async () => {
    const wrapper = shallow(<ApprovalGroupTest access={access} />);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    wrapper.setState(({ selectedAssociations }) => {
        selectedAssociations.add(1);
        return { selectedAssociations };
    });
    await wrapper.instance().handleDelete();
    expect(wrapper.state('associations')).toEqual([{
        key: 2,
        adomGroupName: '1',
        createdTimestamp: 1586224305454,
        networkId: 1,
        subNetworkId: 2,
        createdBy: 'VZID'
    }]);
});

test('Should set sort', async () => {
    const wrapper = shallow(<ApprovalGroupTest access={access} />);
    await Promise.resolve();
    wrapper.instance().handleSort('c', false);
    await Promise.resolve();
    expect(wrapper.state('sort')).toEqual({ c: true });
});

test('Should not save associations to state on error', async () => {
    jest.resetModules();
    jest.doMock('./approval-group-utilities', () => ({
        ApprovalGroupUtilities: {
            getAssociations: () => Promise.reject({ response: {} }),
            getNetworks: () => Promise.reject(''),
            getAdomGroups: () => Promise.reject('')
        }
    }));
    const A = (await import('./approval-group')).ApprovalGroupTest;
    const wrapper = shallow(<A access={access} />);
    await Promise.resolve();
    expect(wrapper.state('associations')).toEqual([]);
});

test('Should not toggle modal without networks and groups', async () => {
    jest.resetModules();
    jest.doMock('./approval-group-utilities', () => ({
        ApprovalGroupUtilities: {
            getAssociations: () => Promise.reject({ response: {} }),
            getNetworks: () => Promise.reject({ response: {} }),
            getAdomGroups: () => Promise.reject({ response: {} })
        }
    }));
    const A = (await import('./approval-group')).ApprovalGroupTest;
    const wrapper = shallow(<A access={access} />);
    await Promise.resolve();
    await wrapper.instance().toggleModal();
    expect(wrapper.state('showModal')).toBe(false);
});

test('Should not delete on error', async () => {
    jest.resetModules();
    jest.doMock('./approval-group-utilities', () => ({
        ApprovalGroupUtilities: {
            getAssociations: () => Promise.reject({ response: {} }),
            getNetworks: () => Promise.reject({ response: {} }),
            getAdomGroups: () => Promise.reject({ response: {} }),
            deleteAssociations: () => Promise.reject({ response: {} })
        }
    }));
    const A = (await import('./approval-group')).ApprovalGroupTest;
    const wrapper = shallow(<A access={access} />);
    await Promise.resolve();
    await wrapper.instance().handleDelete();
    expect(wrapper.state('selectedAssociations').size).toBe(0);
});

test('Should not save users on error', async () => {
    jest.resetModules();
    jest.doMock('./approval-group-utilities', () => ({
        ApprovalGroupUtilities: {
            getAssociations: () => Promise.resolve([{ createdBy: '' }]),
            getNetworks: () => Promise.reject({ response: {} }),
            getAdomGroups: () => Promise.reject({ response: {} }),
            getUser: () => Promise.reject({ response: {} })
        }
    }));
    const A = (await import('./approval-group')).ApprovalGroupTest;
    const wrapper = shallow(<A access={access} />);
    await Promise.resolve();
    expect(wrapper.state('users')).toEqual({ IQBALAM: 'Iqbal, Ammaar' });
});
