import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {getRuns, deleteRuns} from '../actions/DataPackListActions';
import AppBar from 'material-ui/AppBar';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import * as exportActions from '../actions/exportsActions';
import DataPackList from './DataPackList';
import primaryStyles from '../styles/constants.css'
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import DataPackSearchbar from './DataPackSearchbar';
import { Link } from 'react-router';

export class DataPackPage extends React.Component {

    constructor(props) {
        super(props);
        this.screenSizeUpdate = this.screenSizeUpdate.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.checkForEmptySearch = this.checkForEmptySearch.bind(this);
        this.state = {
            runs: [],
            displayedRuns: [],
            dataPackButtonFontSize: '',
            search: {
                searched: false,
                searchQuery: ''
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.runsList.fetched != this.props.runsList.fetched) {
            if (nextProps.runsList.fetched == true) {
                let runs = nextProps.runsList.runs;                
                if(this.state.search.searched) {
                    this.setState({runs: runs}, () => {
                        this.handleSearch(this.state.search.searchQuery, -1);
                    });
                    
                }
                else {
                    this.setState({runs: runs});
                    this.setState({displayedRuns: runs});
                } 
            }
        }
        if (nextProps.runsDeletion.deleted != this.props.runsDeletion.deleted) {
            if(nextProps.runsDeletion.deleted) {
                this.props.getRuns();
            }
        }
    }

    componentWillMount() {
        this.screenSizeUpdate();
        this.props.getRuns();
        window.addEventListener('resize', this.screenSizeUpdate);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.screenSizeUpdate);
    }

    screenSizeUpdate() {
        if(window.innerWidth <= 750) {
            this.setState({dataPackButtonFontSize: '10px'});
        }
        else if (window.innerWidth <= 900) {
            this.setState({dataPackButtonFontSize: '13px'});
        }
        else if (window.innerWidth <= 1000) {
            this.setState({dataPackButtonFontSize: '13px'});
        }
        else {
            this.setState({dataPackButtonFontSize: '14px'});
        }
    }

    handleSearch(searchText, ix) {
        const query = searchText.toUpperCase();
        let searched = filter(this.state.runs, function(o) {
            if(o.job.name.toUpperCase().includes(query)) { return true}
            if(o.job.description.toUpperCase().includes(query)) {return true}
            if(o.job.event.toUpperCase().includes(query)) {return true}
        });
        this.setState({search: {searched: true, searchQuery: searchText}});
        this.setState({displayedRuns: searched});
        
    }

    checkForEmptySearch(searchText, dataSource, params) {
        if(searchText == '') {
            this.setState({search: {searched: false, searchQuery: ''}});
            this.setState({displayedRuns: this.state.runs});
        }
    }

    render() {

        const pageTitle = "DataPack Library"
        const styles = {
            wholeDiv: {
                marginTop:'-10px',
                width:'1000%',
                height: '1000%',
                backgroundImage: 'url(https://cdn.frontify.com/api/screen/thumbnail/aJdxI4Gb10WEO716VTHSrCi7_Loii0H5wGYb5MuB66RmTKhpWG-bQQJ2J68eAjT5ln4d2enQJkV4sVaOWCG2nw)',
                backgroundRepeat: 'repeat repeat',
            },
            appBar: {
                backgroundColor: '#161e2e',
                height: '35px',
                color: 'white',
                fontSize: '14px',
            },
            toolbarCommon: {
                backgroundColor: '#253447',
            },
            toolbarTitleCommon: {
                color: '#4598bf',
            },
            separator: {
                marginLeft: '12px', 
                marginRight: '12px', 
                backgroundColor: '#161e2e',
                opacity: '0.7',
            },
            createDataPackStyle: {
                margin: '0px', 
                minWidth: '50px', 
                height: '35px', 
                borderRadius: '0px'
            },
            createDataPackLabel: {
                fontSize: this.state.dataPackButtonFontSize,
                paddingLeft: '30px', 
                paddingRight: '30px', 
                lineHeight: '35px'
            },
        };

        return (
        <div>
            <AppBar className={primaryStyles.sectionTitle} style={styles.appBar} title={pageTitle}
                    iconElementLeft={<p></p>}>
                <Link to={'/create'}>
                    <RaisedButton 
                        label={"Create DataPack"}
                        primary={true}
                        labelStyle={styles.createDataPackLabel}
                        style={styles.createDataPackStyle}
                        buttonStyle={{borderRadius: '0px'}}
                        overlayStyle={{borderRadius: '0px'}}
                    />
                </Link>
            </AppBar>
            <Toolbar style={styles.toolbarCommon}>
                <ToolbarGroup style={{margin: 'auto', width: '100%'}}>
                    <DataPackSearchbar
                        onSearchChange={this.checkForEmptySearch}
                        onSearchSubmit={this.handleSearch}
                        searchbarWidth={'100%'} 
                    />
                </ToolbarGroup>
            </Toolbar>
            
            <div className={styles.wholeDiv}>
                <div>
                    <DataPackList 
                        runs={this.state.displayedRuns} 
                        user={this.props.user} 
                        onRunDelete={this.props.deleteRuns}/>
                </div>

                <div >
                    {this.props.children}
                </div>
            </div>

        </div>
              
            
        );
    }
}


DataPackPage.propTypes = {
    runsList: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    getRuns: PropTypes.func.isRequired,
    deleteRuns: PropTypes.func.isRequired,
    runsDeletion: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        runsList: state.runsList,
        user: state.user,
        runsDeletion: state.runsDeletion,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getRuns: () => {
            dispatch(getRuns());
        },
        deleteRuns: (uid) => {
            dispatch(deleteRuns(uid));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DataPackPage);