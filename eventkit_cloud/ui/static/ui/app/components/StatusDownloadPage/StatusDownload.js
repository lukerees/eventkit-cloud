import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { browserHistory } from 'react-router';
import Joyride from 'react-joyride';
import Help from '@material-ui/icons/Help';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Warning from '@material-ui/icons/Warning';
import ErrorOutline from '@material-ui/icons/ErrorOutlined';
import PageHeader from '../common/PageHeader';
import PageLoading from '../common/PageLoading';
import DataCartDetails from './DataCartDetails';
import {
    updateAoiInfo,
    updateExportInfo,
    updateDataCartPermissions,
    rerunExport,
    clearReRunInfo,
} from '../../actions/datacartActions';
import { updateExpiration, getDatacartDetails, clearDataCartDetails, deleteRun } from '../../actions/datapackActions';
import { getProviders, cancelProviderTask } from '../../actions/providerActions';
import { viewedJob } from '../../actions/userActivityActions';
import CustomScrollbar from '../../components/CustomScrollbar';
import BaseDialog from '../../components/Dialog/BaseDialog';
import { joyride } from '../../joyride.config';
import { makeDatacartSelector } from '../../selectors/runSelector';

export class StatusDownload extends React.Component {
    constructor(props) {
        super(props);
        this.callback = this.callback.bind(this);
        this.getInitialState = this.getInitialState.bind(this);
        this.clearError = this.clearError.bind(this);
        this.getErrorMessage = this.getErrorMessage.bind(this);
        this.handleWalkthroughClick = this.handleWalkthroughClick.bind(this);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            isLoading: true,
            error: null,
            steps: [],
            isRunning: false,
        };
    }

    componentDidMount() {
        this.onMount();
    }

    shouldComponentUpdate(p) {
        if (p.detailsFetched !== this.props.detailsFetched) {
            if (p.runs !== this.props.runs || this.state.isLoading) {
                return true;
            }
            return false;
        }

        return true;
    }

    componentDidUpdate(prevProps) {
        if (this.props.runDeletion.deleted && !prevProps.runDeletion.deleted) {
            browserHistory.push('/exports');
        }
        if (this.props.exportReRun.error && !prevProps.exportReRun.error) {
            this.setState({ error: this.props.exportReRun.error });
        }
        if (this.props.exportReRun.fetched && !prevProps.exportReRun.fetched) {
            this.props.getDatacartDetails(this.props.router.params.jobuid);
            this.startTimer();
        }
        if (this.props.expirationState.updated && !prevProps.expirationState.updated) {
            this.props.getDatacartDetails(this.props.router.params.jobuid);
        }
        if (this.props.permissionState.updated && !prevProps.permissionState.updated) {
            this.props.getDatacartDetails(this.props.router.params.jobuid);
        }
        if (this.props.detailsFetched && !prevProps.detailsFetched) {
            if (this.state.isLoading) {
                this.setState({ isLoading: false });
            }

            // If no data returned from API we stop here
            if (!this.props.runIds.length) {
                return;
            }

            const datacart = this.props.runs;
            let clearTimer = true;
            if (this.props.runs[0].zipfile_url == null) {
                clearTimer = false;
            }

            // If the status of the job is completed,
            // check the provider tasks to ensure they are all completed as well
            // If a Provider Task does not have a successful outcome, add to a counter.
            // If the counter is greater than 1, that
            // means that at least one task is not completed, so do not stop the timer
            if (clearTimer && (datacart[0].status === 'COMPLETED' || datacart[0].status === 'INCOMPLETE')) {
                const providerTasks = datacart[0].provider_tasks;
                providerTasks.forEach((tasks) => {
                    clearTimer = tasks.tasks.every((task) => {
                        if ((task.status !== 'SUCCESS') && (task.status !== 'CANCELED') && (task.status !== 'FAILED')) {
                            return false;
                        }
                        return true;
                    });
                });

                if (clearTimer) {
                    window.clearInterval(this.timer);
                    this.timer = null;
                    window.clearTimeout(this.timeout);
                    this.timeout = window.setTimeout(() => {
                        this.props.getDatacartDetails(this.props.router.params.jobuid);
                    }, 270000);
                }
            }
        }

        if (this.props.location.pathname !== prevProps.location.pathname) {
            // Refresh the entire component.
            this.componentWillUnmount();
            this.setState(this.getInitialState());
            this.componentDidMount();
        }
    }

    componentWillUnmount() {
        this.props.clearDataCartDetails();
        window.clearInterval(this.timer);
        this.timer = null;
        window.clearTimeout(this.timeout);
        this.timeout = null;
    }

    async onMount() {
        this.props.getDatacartDetails(this.props.router.params.jobuid);
        this.props.viewedJob(this.props.router.params.jobuid);
        this.props.getProviders();
        this.startTimer();

        const steps = joyride.StatusAndDownload;
        this.joyrideAddSteps(steps);
    }

    getMarginPadding() {
        if (!isWidthUp('md', this.props.width)) {
            return '0px';
        }
        return '30px';
    }

    getErrorMessage() {
        if (!this.state.error) {
            return null;
        }

        const messages = this.state.error.map((error, ix) => (
            <div className="StatusDownload-error-container" key={error.detail}>
                { ix > 0 ? <Divider style={{ marginBottom: '10px' }} /> : null }
                <p className="StatusDownload-error-title">
                    <Warning style={{ fill: this.props.theme.eventkit.colors.warning, verticalAlign: 'bottom', marginRight: '10px' }} />
                    <strong>
                        ERROR
                    </strong>
                </p>
                <p className="StatusDownload-error-detail">
                    {error.detail}
                </p>
            </div>
        ));
        return messages;
    }

    handleWalkthroughClick() {
        this.setState({ isRunning: true });
    }

    handleClone(cartDetails, providerArray) {
        this.props.cloneExport(cartDetails, providerArray);
    }

    startTimer() {
        window.clearInterval(this.timer);
        this.timer = window.setInterval(() => {
            this.props.getDatacartDetails(this.props.router.params.jobuid);
        }, 5000);
    }

    clearError() {
        this.setState({ error: null });
    }

    joyrideAddSteps(steps) {
        let newSteps = steps;

        if (!Array.isArray(newSteps)) {
            newSteps = [newSteps];
        }

        if (!newSteps.length) return;

        this.setState((currentState) => {
            const nextState = { ...currentState };
            nextState.steps = nextState.steps.concat(newSteps);
            return nextState;
        });
    }

    callback(data) {
        const { action, type, step } = data;
        if (action === 'close' || action === 'skip' || type === 'finished') {
            this.setState({ isRunning: false });
            this.joyride.reset(true);
            window.location.hash = '';
        }
        if (step && step.scrollToId) {
            window.location.hash = step.scrollToId;
        }
    }

    render() {
        const { colors, images } = this.props.theme.eventkit;

        const { steps, isRunning } = this.state;
        const pageTitle = <div style={{ display: 'inline-block', paddingRight: '10px' }}>Status & Download </div>;

        const marginPadding = this.getMarginPadding();
        const styles = {
            root: {
                height: 'calc(100vh - 95px)',
                width: '100%',
                margin: 'auto',
                overflowY: 'hidden',
                backgroundImage: `url(${images.topo_dark})`,
                backgroundRepeat: 'repeat repeat',
            },
            content: {
                paddingTop: marginPadding,
                paddingBottom: marginPadding,
                paddingLeft: marginPadding,
                paddingRight: marginPadding,
                margin: 'auto',
                maxWidth: '1100px',
            },
            heading: {
                fontSize: '18px',
                fontWeight: 'bold',
                color: colors.black,
                alignContent: 'flex-start',
                paddingBottom: '5px',
            },
            deleting: {
                zIndex: 10,
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'inline-flex',
                backgroundColor: colors.backdrop,
            },
            notFoundIcon: {
                color: colors.warning,
                height: '22px',
                width: '22px',
                verticalAlign: 'bottom',
            },
            notFoundText: {
                fontSize: '16px',
                color: colors.warning,
                fontWeight: 800,
                marginLeft: '5px',
            },
            tourButton: {
                color: colors.primary,
                cursor: 'pointer',
                display: 'inline-block',
                marginLeft: '10px',
                fontSize: '14px',
                height: '30px',
                lineHeight: '30px',
            },
            tourIcon: {
                color: colors.primary,
                cursor: 'pointer',
                height: '18px',
                width: '18px',
                verticalAlign: 'middle',
                marginRight: '5px',
                marginBottom: '5px',
            },
        };

        const iconElementRight = (
            <ButtonBase
                onClick={this.handleWalkthroughClick}
                style={styles.tourButton}
            >
                <Help style={styles.tourIcon} />
                Page Tour
            </ButtonBase>
        );

        const errorMessage = this.getErrorMessage();

        const details = this.props.runs.map((cartDetails) => {
            if (cartDetails.deleted) {
                return (
                    <div
                        key="no-datapack"
                        style={{ textAlign: 'center', padding: '30px' }}
                        className="qa-StatusDownload-DeletedDatapack"
                    >
                        <ErrorOutline style={styles.notFoundIcon} />
                        <span style={styles.notFoundText}>This DataPack has been deleted.</span>
                    </div>
                );
            }
            return (
                <DataCartDetails
                    key={cartDetails.uid}
                    cartDetails={cartDetails}
                    onRunDelete={this.props.deleteRun}
                    onUpdateExpiration={this.props.updateExpirationDate}
                    onUpdateDataCartPermissions={this.props.updateDataCartPermissions}
                    updatingExpiration={this.props.expirationState.updating}
                    updatingPermission={this.props.permissionState.updating}
                    permissionState={this.props.permissionState}
                    onRunRerun={this.props.rerunExport}
                    onClone={this.props.cloneExport}
                    onProviderCancel={this.props.cancelProviderTask}
                    providers={this.props.providers}
                    maxResetExpirationDays={this.context.config.MAX_DATAPACK_EXPIRATION_DAYS}
                    user={this.props.user}
                />
            );
        });

        if (!details.length && !this.state.isLoading) {
            details.push((
                <div
                    key="no-datapack"
                    style={{ textAlign: 'center', padding: '30px' }}
                    className="qa-StatusDownload-NoDatapack"
                >
                    <ErrorOutline style={styles.notFoundIcon} />
                    <span style={styles.notFoundText}>No DataPack Found</span>
                </div>
            ));
        }

        return (
            <div className="qa-StatusDownload-div-root" style={styles.root}>
                <PageHeader title={pageTitle} className="qa-StatusDownload-PageHeader">
                    {iconElementRight}
                </PageHeader>
                {this.props.runDeletion.deleting ?
                    <PageLoading background="transparent" partial style={{ position: 'absolute', zIndex: 10 }} />
                    :
                    null
                }
                <CustomScrollbar
                    ref={(instance) => { this.scrollbar = instance; }}
                    style={{ height: 'calc(100vh - 130px)', width: '100%' }}
                >
                    <div className="qa-StatusDownload-div-content" style={styles.content}>
                        <Joyride
                            callback={this.callback}
                            ref={(instance) => { this.joyride = instance; }}
                            steps={steps}
                            scrollToSteps
                            autoStart
                            type="continuous"
                            showSkipButton
                            showStepsProgress
                            locale={{
                                back: (<span>Back</span>),
                                close: (<span>Close</span>),
                                last: (<span>Done</span>),
                                next: (<span>Next</span>),
                                skip: (<span>Skip</span>),
                            }}
                            run={isRunning}
                        />
                        <form>
                            <Paper className="qa-Paper" style={{ padding: '20px' }} elevation={2} >
                                <div className="qa-StatusDownload-heading" style={styles.heading}>
                                    DataPack Details
                                </div>
                                {this.state.isLoading ?
                                    <PageLoading partial />
                                    :
                                    null
                                }
                                {details}
                                <BaseDialog
                                    className="qa-StatusDownload-BaseDialog-error"
                                    show={!!this.state.error}
                                    title="ERROR"
                                    onClose={this.clearError}
                                >
                                    {errorMessage}
                                </BaseDialog>
                            </Paper>
                        </form>
                    </div>
                </CustomScrollbar>
            </div>
        );
    }
}

StatusDownload.contextTypes = {
    config: PropTypes.object,
};

StatusDownload.propTypes = {
    runs: PropTypes.arrayOf(PropTypes.object).isRequired,
    runIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    detailsFetched: PropTypes.bool.isRequired,
    getDatacartDetails: PropTypes.func.isRequired,
    clearDataCartDetails: PropTypes.func.isRequired,
    deleteRun: PropTypes.func.isRequired,
    runDeletion: PropTypes.object.isRequired,
    rerunExport: PropTypes.func.isRequired,
    exportReRun: PropTypes.object.isRequired,
    updateExpirationDate: PropTypes.func.isRequired,
    updateDataCartPermissions: PropTypes.func.isRequired,
    permissionState: PropTypes.shape({
        updating: PropTypes.bool,
        updated: PropTypes.bool,
        error: PropTypes.array,
    }).isRequired,
    expirationState: PropTypes.shape({
        updating: PropTypes.bool,
        updated: PropTypes.bool,
        error: PropTypes.array,
    }).isRequired,
    cloneExport: PropTypes.func.isRequired,
    cancelProviderTask: PropTypes.func.isRequired,
    getProviders: PropTypes.func.isRequired,
    providers: PropTypes.arrayOf(PropTypes.object).isRequired,
    user: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    viewedJob: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired,
};

const makeMapStateToProps = () => {
    const getDatacart = makeDatacartSelector();
    const mapStateToProps = (state, props) => (
        {
            runIds: state.datacartDetails.ids,
            detailsFetched: state.datacartDetails.status.fetched,
            runDeletion: state.runDeletion,
            expirationState: state.updateExpiration,
            permissionState: state.updatePermission,
            exportReRun: state.exportReRun,
            cancelProviderTask: state.cancelProviderTask,
            providers: state.providers,
            user: state.user,
            runs: getDatacart(state, props),
        }
    );
    return mapStateToProps;
};

function mapDispatchToProps(dispatch) {
    return {
        getDatacartDetails: jobuid => (
            dispatch(getDatacartDetails(jobuid))
        ),
        clearDataCartDetails: () => (
            dispatch(clearDataCartDetails())
        ),
        deleteRun: jobuid => (
            dispatch(deleteRun(jobuid))
        ),
        rerunExport: jobuid => (
            dispatch(rerunExport(jobuid))
        ),
        updateExpirationDate: (uid, expiration) => (
            dispatch(updateExpiration(uid, expiration))
        ),
        updateDataCartPermissions: (uid, permissions) => (
            dispatch(updateDataCartPermissions(uid, permissions))
        ),
        clearReRunInfo: () => (
            dispatch(clearReRunInfo())
        ),
        cloneExport: (cartDetails, providerArray) => {
            const featureCollection = {
                type: 'FeatureCollection',
                features: [cartDetails.job.extent],
            };
            dispatch(updateAoiInfo({
                geojson: featureCollection,
                originalGeojson: featureCollection,
                geomType: 'Polygon',
                title: 'Custom Polygon',
                description: 'Box',
                selectionType: 'box',
                buffer: 0,
            }));
            dispatch(updateExportInfo({
                exportName: cartDetails.job.name,
                datapackDescription: cartDetails.job.description,
                projectName: cartDetails.job.event,
                providers: providerArray,
                layers: 'Geopackage',
            }));
            browserHistory.push('/create');
        },
        cancelProviderTask: providerUid => (
            dispatch(cancelProviderTask(providerUid))
        ),
        getProviders: () => (
            dispatch(getProviders())
        ),
        viewedJob: jobuid => (
            dispatch(viewedJob(jobuid))
        ),
    };
}


export default
@withWidth()
@withTheme()
@connect(makeMapStateToProps, mapDispatchToProps)
class Default extends StatusDownload {}
