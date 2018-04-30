import React from 'react';
import sinon from 'sinon';
import raf from 'raf';
import { mount } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Card, CardHeader, CardText } from 'material-ui/Card';

import Map from 'ol/map';
import VectorSource from 'ol/source/vector';
import GeoJSON from 'ol/format/geojson';

import { ExportSummary } from '../../components/CreateDataPack/ExportSummary';
import CustomScrollbar from '../../components/CustomScrollbar';
import Joyride from 'react-joyride';
import CustomTableRow from '../../components/CustomTableRow';


// this polyfills requestAnimationFrame in the test browser, required for ol3
raf.polyfill();

describe('Export Summary Component', () => {
    const muiTheme = getMuiTheme();

    const tooltipStyle = {
        backgroundColor: 'white',
        borderRadius: '0',
        color: 'black',
        mainColor: '#ff4456',
        textAlign: 'left',
        header: {
            textAlign: 'left',
            fontSize: '20px',
            borderColor: '#4598bf'
        },
        main: {
            paddingTop: '20px',
            paddingBottom: '20px',
        },

        button: {
            color: 'white',
            backgroundColor: '#4598bf'
        },
        skip: {
            color: '#8b9396'
        },
        back: {
            color: '#8b9396'
        },
        hole: {
            backgroundColor: 'rgba(226,226,226, 0.2)',
        }
    };

    const getProps = () => {
        return {
            geojson: {
                "type": "FeatureCollection",
                "features": [{ "type": "Feature",
                    "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                        [100.0, 1.0], [100.0, 0.0] ]
                        ]
                    },}]
            },
            exportName: 'name',
            datapackDescription: 'description',
            projectName: 'project',
            makePublic: true,
            providers: [
                { name: 'one', uid: 1, display: true },
                { name: 'two', uid: 2, display: false },
                { name: 'three', uid: 3, display: false },
            ],
            areaStr: '12 sq km',
            formats: 'gpkg',
            allFormats: [
                {
                    "uid": "ed48a7c1-1fc3-463e-93b3-e93eb3861a5a",
                    "url": "http://cloud.eventkit.test/api/formats/shp",
                    "slug": "shp",
                    "name": "ESRI Shapefile Format",
                    "description": "Esri Shapefile (OSM Schema)"
                },
                {
                    "uid": "978ab89c-caf7-4296-9a0c-836fc679ea07",
                    "url": "http://cloud.eventkit.test/api/formats/gpkg",
                    "slug": "gpkg",
                    "name": "Geopackage",
                    "description": "GeoPackage"
                },
            ],
            walkthroughClicked: false,
            onWalkthroughReset: () => {},
        }
    }

    const getWrapper = (props) => {
        const config = { BASEMAP_URL: 'http://my-osm-tile-service/{z}/{x}/{y}.png' };
        return mount(<ExportSummary {...props} />, {
            context: { muiTheme, config },
            childContextTypes: {
                muiTheme: React.PropTypes.object,
                config: React.PropTypes.object,
            },
        });
    };

    it('should render the basic components', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        expect(wrapper.find(CustomScrollbar)).toHaveLength(1);
        expect(wrapper.find(CustomTableRow)).toHaveLength(6);
        expect(wrapper.find('#form')).toHaveLength(1);
        expect(wrapper.find('#mainHeading').text()).toEqual('Preview and Run Export');
        expect(wrapper.find('#subHeading').text()).toEqual('Please make sure all the information below is correct.');
        expect(wrapper.find('#export-information-heading').text()).toEqual('Export Information');
        expect(wrapper.find('#aoi-heading').text()).toEqual('Area of Interest (AOI)');
        expect(wrapper.find('#aoi-map')).toHaveLength(1);
        expect(wrapper.find(Card)).toHaveLength(1);
        expect(wrapper.find(CardHeader)).toHaveLength(1);
        expect(wrapper.find(CardHeader).text()).toEqual('Selected Area of Interest');
        expect(wrapper.find(CardText)).toHaveLength(0);
        expect(wrapper.find('#summaryMap')).toHaveLength(0);
        expect(wrapper.find(Joyride)).toHaveLength(1);
    });

    it('componentDidMount should setJoyRideSteps', () => {
        const props = getProps();
        const mountSpy = new sinon.spy(ExportSummary.prototype, 'componentDidMount');
        const joyrideSpy = new sinon.spy(ExportSummary.prototype, 'joyrideAddSteps');
        const wrapper = getWrapper(props);
        expect(mountSpy.calledOnce).toBe(true);
        expect(joyrideSpy.calledOnce).toBe(true);
        mountSpy.restore();
        joyrideSpy.restore();
    });

    it('should call initializeOpenLayers  when card is expanded', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        wrapper.instance().initializeOpenLayers = sinon.spy();
        expect(wrapper.instance().initializeOpenLayers.called).toBe(false);
        wrapper.setState({ expanded: true });
        expect(wrapper.instance().initializeOpenLayers.calledOnce).toBe(true);
        wrapper.setState({ expanded: false });
        expect(wrapper.instance().initializeOpenLayers.calledOnce).toBe(true);
    });

    it('expandedChange should call setState', () => {
        const props = getProps();
        const stateSpy = sinon.spy(ExportSummary.prototype, 'setState');
        const wrapper = getWrapper(props);
        expect(stateSpy.called).toBe(false);
        wrapper.instance().expandedChange(true);
        expect(stateSpy.calledOnce).toBe(true);
        expect(stateSpy.calledWith({ expanded: true })).toBe(true);
        stateSpy.restore();
    });

    it('initializeOpenLayers should read a geojson and display it on the map', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        const readerSpy = sinon.spy(GeoJSON.prototype, 'readFeatures');
        const addFeatSpy = sinon.spy(VectorSource.prototype, 'addFeatures');
        const addLayerSpy = sinon.spy(Map.prototype, 'addLayer');
        const getViewSpy = sinon.spy(Map.prototype, 'getView');
        const getExtentSpy = sinon.spy(VectorSource.prototype, 'getExtent');
        const getSizeSpy = sinon.spy(Map.prototype, 'getSize');
        wrapper.instance().initializeOpenLayers();
        expect(readerSpy.calledOnce).toBe(true);
        expect(addFeatSpy.calledOnce).toBe(true);
        expect(addLayerSpy.calledOnce).toBe(true);
        expect(getViewSpy.calledTwice).toBe(true);
        expect(getExtentSpy.calledOnce).toBe(true);
        expect(getSizeSpy.calledOnce).toBe(true);
    });

    it('joyrideAddSteps should set state for steps in tour', () => {
        const steps = [
            {title: 'Verify Information', text: 'Verify the information entered is correct before proceeding.', selector: '.qa-ExportSummary-div', position: 'bottom', style: tooltipStyle,},
            {title: 'Go Back to Edit', text: 'If you need to make changes before submitting, use the small blue arrow to navigate back.', selector: '.qa-BreadcrumbStepper-FloatingActionButton-previous', position: 'bottom', style: tooltipStyle,},
            {title: 'Submit DataPack', text: 'Once ready, click the large green button to kick off the DataPack submission process.<br>You will be redirected to the Status and Download page.', selector: '.qa-BreadcrumbStepper-FloatingActionButton-case2', position: 'bottom', style: tooltipStyle,},];
        const props = getProps();
        const wrapper = getWrapper(props);
        const stateSpy = new sinon.spy(ExportSummary.prototype, 'setState');
        wrapper.update();
        wrapper.instance().joyrideAddSteps(steps);
        expect(stateSpy.calledOnce).toBe(true);
        expect(stateSpy.calledWith({steps: steps}));
        stateSpy.restore();
    });

    it('handleJoyride should set state', () => {
        const props = getProps();
        const stateSpy = new sinon.spy(ExportSummary.prototype, 'setState');
        const wrapper = getWrapper(props);

        wrapper.instance().handleJoyride();
        expect(stateSpy.calledWith({isRunning: false}));
        stateSpy.restore();
    });

    it('callback function should stop tour if close is clicked', () => {
        const callbackData = {
            action: "close",
            index: 2,
            step: {
                position: "bottom",
                selector: ".qa-DataPackLinkButton-RaisedButton",
                style: tooltipStyle,
                text: "Click here to Navigate to Create a DataPack.",
                title: "Create DataPack",
            },
            type: "step:before",
        }
        const props = getProps();
        const wrapper = getWrapper(props);
        const stateSpy = new sinon.spy(ExportSummary.prototype, 'setState');
        wrapper.instance().callback(callbackData);
        expect(stateSpy.calledWith({isRunning: false}));
        stateSpy.restore();
    });
});
