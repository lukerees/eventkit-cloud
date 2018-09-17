import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import CloudDownload from '@material-ui/icons/CloudDownload';
import ProviderRow from './ProviderRow';

const jss = theme => ({
    root: {
        backgroundColor: theme.eventkit.colors.selected_primary,
        color: theme.eventkit.colors.primary,
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: theme.eventkit.colors.selected_primary_dark,
            color: theme.eventkit.colors.primary,
        },
        '&:disabled': {
            backgroundColor: theme.eventkit.colors.secondary_dark,
            color: theme.eventkit.colors.grey,
        },
    },
});

export class DataPackDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedProviders: {},
        };
    }

    componentDidMount() {
        this.onMount();
    }

    onMount() {
        const selectedProviders = {};
        this.props.providerTasks.forEach((provider) => {
            if (provider.display === true) {
                selectedProviders[provider.uid] = false;
            }
        });
        this.setState({ selectedProviders });
    }

    getCloudDownloadIcon() {
        const { colors } = this.props.theme.eventkit;
        if (!this.props.zipFileProp) {
            return (
                <CloudDownload
                    className="qa-DataPackDetails-CloudDownload-disabled"
                    style={{ fill: colors.grey, verticalAlign: 'middle', marginRight: '5px' }}
                />
            );
        }
        return (
            <CloudDownload
                className="qa-DataPackDetails-CloudDownload-enabled"
                style={{ fill: colors.primary, verticalAlign: 'middle', marginRight: '5px' }}
            />
        );
    }

    getTextFontSize() {
        const { width } = this.props;
        if (!isWidthUp('sm', width)) {
            return '10px';
        } else if (!isWidthUp('md', width)) {
            return '11px';
        } else if (!isWidthUp('lg', width)) {
            return '12px';
        } else if (!isWidthUp('xl', width)) {
            return '13px';
        }
        return '14px';
    }

    getTableCellWidth() {
        if (!isWidthUp('md', this.props.width)) {
            return '80px';
        }
        return '120px';
    }

    getToggleCellWidth() {
        return '86px';
    }

    isZipFileCompleted() {
        if (!this.props.zipFileProp) {
            return false;
        }
        return true;
    }

    render() {
        const { colors } = this.props.theme.eventkit;

        const tableCellWidth = this.getTableCellWidth();
        const toggleCellWidth = this.getToggleCellWidth();
        const textFontSize = this.getTextFontSize();

        const providers = this.props.providerTasks.filter(provider => (provider.display));

        const styles = {
            subHeading: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: colors.black,
                alignContent: 'flex-start',
                paddingBottom: '5px',
            },
            download: {
                paddingRight: '12px',
                paddingLeft: '0px',
                fontSize: textFontSize,
                whiteSpace: 'normal',
            },
            genericColumn: {
                paddingRight: '0px',
                paddingLeft: '0px',
                width: tableCellWidth,
                textAlign: 'center',
                fontSize: textFontSize,
            },
        };

        const { classes } = this.props;

        return (
            <div>
                <div className="qa-DataPackDetails-heading" style={styles.subHeading}>
                   Download Options
                </div>
                <Table
                    className="qa-DataPackDetails-Table"
                    style={{ width: '100%', tableLayout: 'fixed' }}
                >
                    <TableBody
                        className="qa-DataPackDetails-TableHeader"
                    >
                        <TableRow className="qa-DataPackDetails-TableRow">
                            <TableCell
                                className="qa-DataPackDetails-TableCell-zipButton"
                                style={styles.download}
                            >
                                <Button
                                    id="CompleteDownload"
                                    href={this.props.zipFileProp}
                                    variant="contained"
                                    className="qa-DataPackDetails-Button-zipButton"
                                    classes={{ root: classes.root }}
                                    disabled={!this.isZipFileCompleted()}
                                    style={{ fontSize: textFontSize, lineHeight: 'initial' }}
                                >
                                    {this.getCloudDownloadIcon()}
                                    {this.props.zipFileProp ? 'DOWNLOAD DATAPACK (.ZIP)' : 'CREATING DATAPACK ZIP'}

                                </Button>
                            </TableCell>
                            <TableCell
                                className="qa-DataPackDetails-TableCell-fileSize"
                                style={styles.genericColumn}
                            >
                                FILE SIZE
                            </TableCell>
                            <TableCell
                                className="qa-DataPackDetails-TableCell-progress"
                                style={styles.genericColumn}
                            >
                                PROGRESS
                            </TableCell>
                            <TableCell
                                className="qa-DataPackDetails-TableCell-empty"
                                style={{ ...styles.genericColumn, width: toggleCellWidth }}
                            />
                        </TableRow>
                    </TableBody>
                </Table>
                <div className="qa-DataPackDetails-providers" id="Providers">
                    {providers.map((provider, ix) => (
                        <ProviderRow
                            backgroundColor={ix % 2 === 0 ? colors.secondary : colors.white}
                            key={provider.uid}
                            onSelectionToggle={this.onSelectionToggle}
                            onProviderCancel={this.props.onProviderCancel}
                            updateSelectionNumber={this.updateSelectionNumber}
                            provider={provider}
                            selectedProviders={this.state.selectedProviders}
                            providers={this.props.providers}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

DataPackDetails.defaultProps = {
    zipFileProp: null,
};

DataPackDetails.propTypes = {
    providerTasks: PropTypes.arrayOf(PropTypes.object).isRequired,
    onProviderCancel: PropTypes.func.isRequired,
    providers: PropTypes.arrayOf(PropTypes.object).isRequired,
    zipFileProp: PropTypes.string,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired,
};

export default
@withWidth()
@withStyles(jss, { withTheme: true })
class Default extends DataPackDetails {}
