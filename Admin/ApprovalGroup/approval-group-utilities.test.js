jest.mock('../../../api');
import { ApprovalGroupUtilities } from './approval-group-utilities';

beforeEach(() => {
    jest.resetModules();
});

test('Should get ADOM groups', async () => {
    const ret = await ApprovalGroupUtilities.getRecentAdomGroups(5);
    expect(ret).toEqual('mock');
});

test('Should search ADOM groups', async () => {
    jest.doMock('axios', () => ({
        get: async () => ({ data: { groupsList: [{ Group: 'mock' }] } })
    }));
    const a = (await import('./approval-group-utilities')).ApprovalGroupUtilities;
    const ret = await a.searchAdomGroups('test');
    expect(ret).toEqual(['mock']);
});

test('Should get associations array', async () => {
    jest.doMock('../../../api', () => ({
        get: async () => ({ data: ['mock'] })
    }));
    const a = (await import('./approval-group-utilities')).ApprovalGroupUtilities;
    const ret = await a.getAssociations();
    expect(ret).toEqual(['mock']);
});

test('Should get associations empty', async () => {
    const ret = await ApprovalGroupUtilities.getAssociations();
    expect(ret).toEqual([]);
});

test('Should add associations', async () => {
    const ret = await ApprovalGroupUtilities.addAssociations();
    expect(ret).toEqual('mock');
});

test('Should delete associations', async () => {
    const ret = await ApprovalGroupUtilities.deleteAssociations();
    expect(ret).toEqual('mock');
});

test('Should get networks', async () => {
    const ret = await ApprovalGroupUtilities.getNetworks();
    expect(ret).toEqual('mock');
});

test('Should get user', async () => {
    const ret = await ApprovalGroupUtilities.getUser();
    expect(ret).toEqual('mock');
});
