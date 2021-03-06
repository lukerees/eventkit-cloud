import React from 'react';
import sinon from 'sinon';
import { createShallow } from '@material-ui/core/test-utils';
import ButtonBase from '@material-ui/core/ButtonBase';
import SocialGroup from '@material-ui/icons/Group';
import Lock from '@material-ui/icons/LockOutlined';
import DropDownMenu from '../../components/common/DropDownMenu';
import DataPackShareDialog from '../../components/DataPackShareDialog/DataPackShareDialog';
import { PermissionsData } from '../../components/StatusDownloadPage/PermissionsData';

describe('PermissionsData component', () => {
    let shallow;

    beforeAll(() => {
        shallow = createShallow();
    });

    const getProps = () => (
        {
            permissions: {
                value: 'PRIVATE',
                groups: {},
                members: { admin: 'ADMIN' },
            },
            handlePermissionsChange: () => {},
            members: [
                { user: { username: 'user_one' } },
                { user: { username: 'user_two' } },
            ],
            groups: [
                { id: 1 },
                { id: 2 },
            ],
            adminPermissions: true,
            user: { user: { username: 'admin' } },
            ...global.eventkit_test_props,
        }
    );

    const getWrapper = props => (
        shallow(<PermissionsData {...props} />)
    );

    it('should render non-admin shared', () => {
        const props = getProps();
        props.permissions.value = 'PUBLIC';
        props.adminPermissions = false;
        const wrapper = getWrapper(props);
        expect(wrapper.find(SocialGroup)).toHaveLength(1);
        expect(wrapper.find(DropDownMenu)).toHaveLength(0);
    });

    it('should render non-admin private', () => {
        const props = getProps();
        props.permissions.value = 'PRIVATE';
        props.adminPermissions = false;
        const wrapper = getWrapper(props);
        expect(wrapper.find(Lock)).toHaveLength(1);
        expect(wrapper.find(DropDownMenu)).toHaveLength(0);
    });

    it('should render the share dialog', () => {
        const props = getProps();
        const stub = sinon.stub(DataPackShareDialog.prototype, 'render').returns(null);
        const wrapper = getWrapper(props);
        wrapper.setState({ shareDialogOpen: true });
        expect(wrapper.find(DataPackShareDialog)).toHaveLength(1);
        stub.restore();
    });

    it('should display the correct members and groups text', () => {
        const props = getProps();
        props.permissions.value = 'SHARED';
        const wrapper = getWrapper(props);
        let button = wrapper.find(ButtonBase);
        expect(button).toHaveLength(1);
        expect(button.html()).toContain('No Members / No Groups');

        let nextProps = getProps();
        nextProps.permissions = {
            value: 'SHARED',
            groups: { 1: 'READ', 2: 'READ' },
            members: { user_one: 'READ', user_two: 'READ' },
        };
        wrapper.setProps(nextProps);
        button = wrapper.find(ButtonBase);
        expect(button.html()).toContain('2 Members / 2 Groups');

        nextProps = getProps();
        nextProps.permissions = {
            value: 'SHARED',
            groups: { 1: 'READ' },
            members: { user_one: 'READ' },
        };
        wrapper.setProps(nextProps);
        button = wrapper.find(ButtonBase);
        expect(button.html()).toContain('1 Member / 1 Group');


        nextProps = getProps();
        nextProps.permissions = {
            value: 'SHARED',
            groups: { 1: 'READ', 2: 'READ', 3: 'READ' },
            members: { user_one: 'READ', user_two: 'READ', user_three: 'READ' },
        };
        wrapper.setProps(nextProps);
        button = wrapper.find(ButtonBase);
        expect(button.html()).toContain('3 Members / 3 Groups');
    });

    it('handleShareDialogOpen should set open to true', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        const stateStub = sinon.stub(wrapper.instance(), 'setState');
        wrapper.instance().handleShareDialogOpen();
        expect(stateStub.calledOnce).toBe(true);
        expect(stateStub.calledWith({ shareDialogOpen: true })).toBe(true);
        stateStub.restore();
    });

    it('handleShareDialogClose should set close to true', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        const stateStub = sinon.stub(wrapper.instance(), 'setState');
        wrapper.instance().handleShareDialogClose();
        expect(stateStub.calledOnce).toBe(true);
        expect(stateStub.calledWith({ shareDialogOpen: false })).toBe(true);
        stateStub.restore();
    });

    it('handleShareDialogSave should call handleChange and Close', () => {
        const props = getProps();
        props.handlePermissionsChange = sinon.spy();
        const wrapper = getWrapper(props);
        const closeStub = sinon.stub(wrapper.instance(), 'handleShareDialogClose');
        const newPermissions = {
            value: 'SHARED',
            members: { user_one: 'ADMIN', user_two: 'READ' },
            groups: { group_one: 'READ', group_two: 'READ' },
        };
        wrapper.instance().handleShareDialogSave(newPermissions);
        expect(props.handlePermissionsChange.calledOnce).toBe(true);
        expect(props.handlePermissionsChange.calledWith({ ...newPermissions })).toBe(true);
        expect(closeStub.calledOnce).toBe(true);
        closeStub.restore();
    });

    it('handleDropDownChange should update the permission value', () => {
        const props = getProps();
        props.handlePermissionsChange = sinon.spy();
        const wrapper = getWrapper(props);
        wrapper.instance().handleDropDownChange('SHARED');
        expect(props.handlePermissionsChange.calledOnce).toBe(true);
        expect(props.handlePermissionsChange.calledWith({ ...props.permissions, value: 'SHARED' })).toBe(true);
    });

    it('handleDropDownChange should clear permission groups and members', () => {
        const props = getProps();
        props.handlePermissionsChange = sinon.spy();
        props.permissions.groups = { group1: 'member' };
        props.permissions.members = { member1: 'member' };
        const wrapper = getWrapper(props);
        wrapper.instance().handleDropDownChange('PRIVATE');
        expect(props.handlePermissionsChange.calledOnce).toBe(true);
        expect(props.handlePermissionsChange.calledWith({
            value: 'PRIVATE',
            members: {},
            groups: {},
        })).toBe(true);
    });

    it('handleDropDownChange should clear permission groups and members but add user as admin member', () => {
        const props = getProps();
        props.handlePermissionsChange = sinon.spy();
        props.permissions.groups = { group1: 'MEMBER' };
        props.permissions.members = { member1: 'MEMBER', [props.user.user.username]: 'ADMIN' };
        const wrapper = getWrapper(props);
        wrapper.instance().handleDropDownChange('PRIVATE');
        expect(props.handlePermissionsChange.calledOnce).toBe(true);
        expect(props.handlePermissionsChange.calledWith({
            value: 'PRIVATE',
            members: { [props.user.user.username]: 'ADMIN' },
            groups: {},
        })).toBe(true);
    });
});
