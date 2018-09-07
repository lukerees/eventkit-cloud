import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import Button from '@material-ui/core/Button';
import { DataPackFilterButton } from '../../components/DataPackPage/DataPackFilterButton';

describe('DataPackFilterButton component', () => {
    const getProps = () => ({
        active: false,
        handleToggle: () => {},
        ...global.eventkit_test_props,
    });

    it('should render a flat button with proper label', () => {
        const props = getProps();
        const wrapper = shallow(<DataPackFilterButton {...props} />);
        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.html()).toContain('SHOW FILTERS');

        const nextProps = getProps();
        nextProps.active = true;
        wrapper.setProps(nextProps);
        expect(wrapper.html()).toContain('HIDE FILTERS');
    });

    it('should call handleToggle', () => {
        const props = getProps();
        props.handleToggle = sinon.spy();
        const wrapper = shallow(<DataPackFilterButton {...props} />);
        wrapper.find(Button).simulate('click');
        expect(props.handleToggle.calledOnce).toBe(true);
    });

    it('should display differently on small vs large screens', () => {
        global.window.resizeTo(1000, 900);
        expect(global.window.innerWidth).toBe(1000);
        const props = getProps();
        const wrapper = shallow(<DataPackFilterButton {...props} />);
        expect(wrapper.find(Button).props().style.width).toEqual('90px');
        expect(wrapper.find(Button).props().style.fontSize).toEqual('12px');

        global.window.resizeTo(400, 500);
        expect(global.window.innerWidth).toBe(400);
        wrapper.instance().forceUpdate();
        wrapper.update();
        expect(wrapper.find(Button).props().style.width).toEqual('40px');
        expect(wrapper.find(Button).props().style.fontSize).toEqual('10px');
    });
});
