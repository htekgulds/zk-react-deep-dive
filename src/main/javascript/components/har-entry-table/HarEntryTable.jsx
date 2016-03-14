require('fixed-data-table/dist/fixed-data-table.css');
require('./_har-entry-table.scss')

import React from 'react';
import DOM from 'react-dom';
import d3 from 'd3';

import FixedDataTable from 'fixed-data-table';
import TimeBar from '../timebar/TimeBar.jsx';

const {Table, Column, Cell} = FixedDataTable;
const GutterWidth = 30;
const headers = {
    url: "URL",
    size: "Size",
    time: "Timeline"
};

export default class HarEntryTable extends React.Component {

    constructor() {
        super();
        this.state = {
            columnWidths: {
                url: 600,
                size: 100,
                time: 200
            },
            sortDirection: {
                url: null,
                size: null,
                time: null
            },
            tableWidth: 1000,
            tableHeight: 500,
            isColumnResizing: false
        };
    }

    render() {
        return(
            <Table ref="entriesTable"
                   rowsCount={this.props.entries.length}
                   width={this.state.tableWidth}
                   headerHeight={40}
                   height={this.state.tableHeight}
                   rowHeight={40}
                   isColumnResizing={this.state.isColumnResizing}
                   onColumnResizeEndCallback={this._onColumnResized.bind(this)}>

                <Column columnKey="url"
                        width={this.state.columnWidths.url}
                        isResizable={true}
                        header={this._renderHeader.bind(this)}
                        cell={this._getCell.bind(this)}
                        flexGrow={null}/>
                <Column columnKey="size"
                        width={this.state.columnWidths.size}
                        isResizable={true}
                        cell={this._getCell.bind(this)}
                        header={this._renderHeader.bind(this)} />
                <Column columnKey="time"
                        width={this.state.columnWidths.time}
                        isResizable={true}
                        minWidth={200}
                        cell={this._getTimelineCell.bind(this)}
                        header={this._renderHeader.bind(this)} />
            </Table>
        );
    }

    _getCell({columnKey, rowIndex}) {
        return (
            <div className="entry-table-row"><Cell>{this._readKey(columnKey, this.props.entries[rowIndex])}</Cell></div>
        );
    }

    _getTimelineCell({columnkey, rowIndex}) {
        var rowData = this.props.entries[rowIndex];
        var start = rowData.time.start,
            total = rowData.time.total,
            pgTimings = this.props.page.pageTimings,
            scale = this._prepareScale(this.props.entries, this.props.page);

        return (
            <TimeBar scale={scale}
                     start={start}
                     total={total}
                     timings={rowData.time.details}
                     domContentLoad={pgTimings.onContentLoad}
                     pageLoad={pgTimings.onLoad} />
        );
    }

    _prepareScale(entries, page) {
        var startTime = 0,
            lastEntry = _.last(entries),
            endTime = lastEntry.time.start + lastEntry.time.total,
            maxTime = Math.max(endTime, page.pageTimings.onLoad);

        var scale = d3.scale.linear()
                .domain([startTime, Math.ceil(maxTime)])
                .range([0, 100]);

        return scale;
    }

    _readKey(key, entry) {
        var keyMap = {
            url: 'request.url',
            time: 'time.start'
        };

        key = keyMap[key] || key;
        return _.get(entry, key);
    }

    _onColumnResized(newColumnWidth, dataKey) {
        var columnWidts = this.state.columnWidths;
        columnWidts[dataKey] = newColumnWidth;

        this.setState({ columnWidths: columnWidts, isColumnResizing: false });
    }

    //---------------------------------------
    // Table Resizing
    //---------------------------------------
    componentDidMount() {
        window.addEventListener('resize', _.debounce(this._onResize.bind(this), 50, {loading: true, trailing: true}));
        this._onResize();
    }

    _onResize() {
        var parent = DOM.findDOMNode(this.refs.entriesTable).parentNode;

        this.setState({
            tableWidth: parent.clientWidth - GutterWidth,
            tableHeight: document.body.clientHeight - parent.offsetTop - GutterWidth * 0.5
        });
    }

    //---------------------------------------
    // Table Sorting
    //---------------------------------------
    _renderHeader({columnKey}) {
        var dir = this.state.sortDirection[columnKey],
            classMap = {
                asc: 'glyphicon glyphicon-sort-by-attributes',
                desc: 'glyphicon glyphicon-sort-by-attributes-alt'
            };
        var sortClass = dir ? classMap[dir] : '';

        return (
            <div className="text-primary sortable" onClick={this._columnClicked.bind(this, columnKey)}>
                <Cell>
                    <strong>{headers[columnKey]}</strong>
                    &nbsp;
                    <i className={sortClass}/>
                </Cell>
            </div>
        );
    }

    _columnClicked(columnKey) {
        var sortDirections = this.state.sortDirection,
            dir = sortDirections[columnKey];

        if (dir === null) { dir = 'asc'; }
        else if (dir === 'asc') { dir = 'desc'; }
        else if (dir === 'desc') { dir = null; }

        _.each(_.keys(sortDirections), x => {
            sortDirections[x] = null;
        });
        sortDirections[columnKey] = dir;

        this.setState({
            sortDirection: sortDirections
        });

        if (this.props.onColumnSort) {
            this.props.onColumnSort(columnKey, dir);
        }
    }
}

HarEntryTable.defaultProps = {
    entries: [],
    page: null,
    onColumnSort: null
};

HarEntryTable.propTypes = {
    entries: React.PropTypes.array,
    page: React.PropTypes.object,
    onColumnSort: React.PropTypes.func
};
