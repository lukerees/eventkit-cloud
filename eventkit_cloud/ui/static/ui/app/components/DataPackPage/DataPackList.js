import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import GridList from '@material-ui/core/GridList';
import NavigationArrowDropDown from '@material-ui/icons/ArrowDropDown';
import NavigationArrowDropUp from '@material-ui/icons/ArrowDropUp';
import DataPackListItem from './DataPackListItem';
import DataPackTableItem from './DataPackTableItem';
import LoadButtons from '../common/LoadButtons';
import CustomScrollbar from '../CustomScrollbar';
import withRef from '../../utils/withRef';

export class DataPackList extends Component {
    constructor(props) {
        super(props);
        this.handleOrder = this.handleOrder.bind(this);
        this.getIcon = this.getIcon.bind(this);
        this.getHeaderStyle = this.getHeaderStyle.bind(this);
        this.isSameOrderType = this.isSameOrderType.bind(this);
    }

    // If it is a 'reversed' order the arrow should be up, otherwise it should be down
    getIcon(order) {
        const style = { verticalAlign: 'middle', marginBottom: '2px', fill: this.props.theme.eventkit.colors.primary };
        const icon = this.props.order === order ?
            <NavigationArrowDropUp className="qa-DataPackList-NavigationArrowDropUp" style={style} />
            :
            <NavigationArrowDropDown className="qa-DataPackList-NavigationArrowDropDown" style={style} />;
        return icon;
    }

    getHeaderStyle(isActive) {
        return isActive ? { color: this.props.theme.eventkit.colors.black, fontWeight: 'bold' } : { color: 'inherit' };
    }

    getScrollbar() {
        return this.scrollbar;
    }

    isSameOrderType(unknown, known) {
        return unknown.replace(/-/, '') === known.replace(/-/, '');
    }

    handleOrder(order) {
        let newOrder = '';
        if (this.isSameOrderType(this.props.order, order)) {
            newOrder = this.props.order.charAt(0) === '-' ? this.props.order.substring(1) : `-${this.props.order}`;
        } else {
            newOrder = order;
        }
        this.props.onSort(newOrder);
    }

    render() {
        const { colors } = this.props.theme.eventkit;

        const spacing = isWidthUp('sm', this.props.width) ? '10px' : '2px';
        const styles = {
            root: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                marginLeft: spacing,
                marginRight: spacing,
                paddingBottom: spacing,
            },
            headerTable: {
                backgroundColor: colors.white,
                borderBottom: `1px solid ${colors.secondary}`,
                fontSize: '12px',
                tableLayout: 'fixed',
            },
            clickable: {
                cursor: 'pointer',
            },
            tableRow: {
                height: '50px',
            },
            nameColumn: {
                padding: '0px 0px 0px 10px',
                textAlign: 'left',
                height: 'inherit',
            },
            eventColumn: {
                padding: '0px 0px 0px 10px',
                textAlign: 'left',
                height: 'inherit',
            },
            dateColumn: {
                width: '98px',
                padding: '0px 0px 0px 10px',
                textAlign: 'left',
                height: 'inherit',
            },
            statusColumn: {
                width: '70px',
                padding: '0px 0px 0px 10px',
                textAlign: 'center',
                height: 'inherit',
            },
            permissionsColumn: {
                width: '102px',
                padding: '0px 0px 0px 10px',
                textAlign: 'center',
                height: 'inherit',
            },
            ownerColumn: {
                padding: '0px 0px 0px 10px',
                textAlign: 'left',
                height: 'inherit',
            },
            featuredColum: {
                padding: '0px 0px 0px 10px',
                textAlign: 'left',
                height: 'inherit',
                width: '82px',
            },
        };

        const load = (
            <LoadButtons
                style={{ paddingTop: '10px' }}
                range={this.props.range}
                handleLoadLess={this.props.handleLoadLess}
                handleLoadMore={this.props.handleLoadMore}
                loadLessDisabled={this.props.loadLessDisabled}
                loadMoreDisabled={this.props.loadMoreDisabled}
            />
        );

        if (!isWidthUp('md', this.props.width)) {
            return (
                <CustomScrollbar
                    ref={(instance) => { this.scrollbar = instance; }}
                    style={{ height: 'calc(100vh - 236px)', width: '100%' }}
                >
                    <div style={styles.root} className="qa-DataPackList-root">
                        <GridList
                            className="qa-DataPackList-GridList"
                            cellHeight="auto"
                            cols={1}
                            spacing={0}
                            style={{ width: '100%', minWidth: '360px' }}
                        >
                            {this.props.runIds.map(id => (
                                <DataPackListItem
                                    runId={id}
                                    user={this.props.user}
                                    key={id}
                                    onRunDelete={this.props.onRunDelete}
                                    onRunShare={this.props.onRunShare}
                                    providers={this.props.providers}
                                />
                            ))}
                            {load}
                        </GridList>
                    </div>
                </CustomScrollbar>
            );
        }

        return (
            <div>
                <div style={styles.root} className="qa-DataPackList-root">
                    <Table
                        className="qa-DataPackList-Table-list"
                        style={styles.headerTable}
                    >
                        <TableBody
                            className="qa-DataPackList-TableHeader"
                            style={{ height: '50px' }}
                        >
                            <TableRow className="qa-DataPackList-TableRow" style={styles.tableRow}>
                                <TableCell
                                    className="qa-DataPackList-TableCell-name"
                                    style={styles.nameColumn}
                                >
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={() => { this.handleOrder('job__name'); }}
                                        onClick={() => { this.handleOrder('job__name'); }}
                                        style={styles.clickable}
                                    >
                                        <span style={this.getHeaderStyle(this.isSameOrderType(this.props.order, 'job__name'))}>Name</span>
                                        {this.getIcon('-job__name')}
                                    </div>
                                </TableCell>
                                <TableCell className="qa-DataPackList-TableCell-event" style={styles.eventColumn}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={() => { this.handleOrder('job__event'); }}
                                        onClick={() => { this.handleOrder('job__event'); }}
                                        style={styles.clickable}
                                    >
                                        <span style={this.getHeaderStyle(this.isSameOrderType(this.props.order, 'job__event'))}>Event</span>
                                        {this.getIcon('-job__event')}
                                    </div>
                                </TableCell>
                                <TableCell className="qa-DataPackList-TableCell-date" style={styles.dateColumn}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={() => { this.handleOrder('-started_at'); }}
                                        onClick={() => { this.handleOrder('-started_at'); }}
                                        style={styles.clickable}
                                    >
                                        <span style={this.getHeaderStyle(this.isSameOrderType(this.props.order, 'started_at'))}>
                                            Date Added
                                        </span>
                                        {this.getIcon('started_at')}
                                    </div>
                                </TableCell>
                                <TableCell className="qa-DataPackList-TableCell-status" style={styles.statusColumn}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={() => { this.handleOrder('status'); }}
                                        onClick={() => { this.handleOrder('status'); }}
                                        style={styles.clickable}
                                    >
                                        <span style={this.getHeaderStyle(this.isSameOrderType(this.props.order, 'status'))}>
                                            Status
                                        </span>
                                        {this.getIcon('-status')}
                                    </div>
                                </TableCell>
                                <TableCell
                                    className="qa-DataPackList-TableCell-permission"
                                    style={styles.permissionsColumn}
                                >
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={() => { this.handleOrder('job__published'); }}
                                        onClick={() => { this.handleOrder('job__published'); }}
                                        style={styles.clickable}
                                    >
                                        <span style={this.getHeaderStyle(this.isSameOrderType(this.props.order, 'job__published'))}>
                                            Permissions
                                        </span>
                                        {this.getIcon('-job__published')}
                                    </div>
                                </TableCell>
                                <TableCell className="qa-DataPackList-TableCell-owner" style={styles.ownerColumn}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={() => { this.handleOrder('user__username'); }}
                                        onClick={() => { this.handleOrder('user__username'); }}
                                        style={styles.clickable}
                                    >
                                        <span style={this.getHeaderStyle(this.isSameOrderType(this.props.order, 'user__username'))}>
                                            Owner
                                        </span>
                                        {this.getIcon('-user__username')}
                                    </div>
                                </TableCell>
                                <TableCell className="qa-DataPackList-TableCell-featured" style={styles.featuredColum}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={() => { this.handleOrder('-job_featured'); }}
                                        onClick={() => { this.handleOrder('-job__featured'); }}
                                        style={styles.clickable}
                                    >
                                        <span style={this.getHeaderStyle(this.isSameOrderType(this.props.order, 'job__featured'))}>
                                            Featured
                                        </span>
                                        {this.getIcon('job__featured')}
                                    </div>
                                </TableCell>
                                <TableCell style={{ padding: '0px', width: '35px', height: 'inherit' }} />
                            </TableRow>
                        </TableBody>
                    </Table>
                    <CustomScrollbar
                        ref={(instance) => { this.scrollbar = instance; }}
                        style={{ height: 'calc(100vh - 287px)' }}
                    >
                        <Table
                            className="qa-DataPackList-Table-item"
                            style={{ backgroundColor: colors.white, fontSize: '12px', tableLayout: 'fixed' }}
                        >
                            <TableBody>
                                {this.props.runIds.map(id => (
                                    <DataPackTableItem
                                        runId={id}
                                        user={this.props.user}
                                        key={id}
                                        onRunDelete={this.props.onRunDelete}
                                        onRunShare={this.props.onRunShare}
                                        providers={this.props.providers}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                        {load}
                    </CustomScrollbar>
                </div>
            </div>
        );
    }
}

DataPackList.propTypes = {
    runIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    user: PropTypes.object.isRequired,
    onRunDelete: PropTypes.func.isRequired,
    onRunShare: PropTypes.func.isRequired,
    onSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    providers: PropTypes.arrayOf(PropTypes.object).isRequired,
    range: PropTypes.string.isRequired,
    handleLoadLess: PropTypes.func.isRequired,
    handleLoadMore: PropTypes.func.isRequired,
    loadLessDisabled: PropTypes.bool.isRequired,
    loadMoreDisabled: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired,
};

export default
@withWidth()
@withTheme()
@withRef()
class Default extends DataPackList {}
