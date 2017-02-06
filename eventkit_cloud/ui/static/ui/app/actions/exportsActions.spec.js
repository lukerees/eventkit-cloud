import * as actions from './exportsActions';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('export actions', () => {

    let jobs = {
        uuid: '12345',
        name: 'test-job-name'
    }
    let bbox = [-180, -90, 180, 90];

    let geojson = { "type": "FeatureCollection",
        "features": [
        { "type": "Feature",
            "geometry": {
            "type": "Polygon",
            "coordinates": [
                [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                [100.0, 1.0], [100.0, 0.0] ]
                ]
            },
            }
        ]
        };
    let mode = "DRAW_MODE_NORMAL";

    it('loadJobSuccess should create LOAD_JOB_SUCCESS action', () => {
        expect(actions.loadJobsSuccess(jobs)).toEqual({
            type: 'LOAD_JOBS_SUCCESS',
            jobs: jobs,
        })
    })

    it('updateBbox should return passed in bbox', () => {
        expect(actions.updateBbox(bbox)).toEqual({
            type: 'UPDATE_BBOX',
            bbox: bbox
        })
    })

    it('updateGeojson should return passed in json', () => {
        expect(actions.updateGeojson(geojson)).toEqual({
            type: 'UPDATE_GEOJSON',
            geojson: geojson
        })
    })

    it('updateMode should return the passed in mode string', () => {
        expect(actions.updateMode(mode)).toEqual({
            type: 'SET_MODE',
            mode: mode
        })
    })

    it('setAOI should return true', () => {
        expect(actions.setAOI()).toEqual({
            type: 'SET_AOI',
            isAOISet: true
        })
    })

    it('unsetAOI should return false', () => {
        expect(actions.unsetAOI()).toEqual({
            type: 'UNSET_AOI',
            isAOISet: false
        })
    })
})

describe('async export actions', () => {

    afterEach(() => {
        nock.cleanAll();
    })

    let jobs = {'job1': {'somedata': [1]}, 'job2': {'moredata': [2]}}
    
    it('loadExports should create LOAD_JOBS_SUCCESS after fetching', () => {
        nock('http://http://cloud.eventkit.dev:8080/api/')
            .get('/jobs')
            .reply(200, jobs)

        const expectedActions = [
            {type: 'LOAD_JOBS_SUCCESS', jobs: jobs}
        ]
        const store = mockStore({ jobs: {} });
        return store.dispatch(actions.loadExports())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
    })
    
})
