require('fixed-data-table/dist/fixed-data-table.css');
require('../samples');

import React from 'react';
import DOM from 'react-dom';
import _ from 'lodash';
import {Grid, Row, Col, PageHeader, Button, ButtonGroup, Input, Alert} from 'react-bootstrap';
import mimeTypes from '../core/mime-types.js';

import HarEntryTable from './HarEntryTable.jsx';
import harParser from '../core/har-parser';

export default class HarViewer extends React.Component {

    constructor() {
        super();
        this.state = this._initialState();
    }

    _initialState() {
        return {
            activeHar: null,
            entries: []
        };
    }

    render() {

        var content = this.state.activeHar ? this._renderViewer(this.state.activeHar) : this._renderEmptyViewer();

        return(
            <div>
                {this._renderHeader()}
                {content}
            </div>
        );
    }

    _renderEmptyViewer() {

        return (
            <Grid fluid>
                <Row>
                    <Col sm={12}>
                        <p></p>
                        <Alert bsStyle="warning">
                            <strong>No HAR loaded</strong>
                        </Alert>
                    </Col>
                </Row>
            </Grid>
        );
    }

    _renderViewer(har) {
        var pages = harParser.parse(har),
            currentPage = pages[0];

        var entries = currentPage.entries;

        return (
            <Grid fluid>
                <Row>
                    <Col sm={12}>
                        <HarEntryTable entries={entries} />
                    </Col>
                </Row>
            </Grid>
        );
    }

    _renderHeader() {

        var buttons = _.map(_.keys(mimeTypes.types), (x) => {
            return this._createButton(x, mimeTypes.types[x].label);
        });

        var options = _.map(window.samples, (s) => {
            return (<option key={s.id} value={s.id}>{s.label}</option>);
        });

        return (
            <Grid fluid>
                <Row>
                    <Col sm={12}>
                        <PageHeader>Har Viewer</PageHeader>
                    </Col>
                </Row>

                <Row>
                    <Col sm={3} smOffset={9}>
                        <div>
                            <label className="control-label" />
                            <select ref="selector" className="form-control" onChange={this._sampleChanged.bind(this)}>
                                <option value="">---</option>
                                {options}
                            </select>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col sm={12}>
                        <p>Pie Chart</p>
                    </Col>
                </Row>

                <Row>
                    <Col sm={8}>
                        <ButtonGroup bsSize="small">
                            {this._createButton('all', 'All')}
                            {buttons}
                        </ButtonGroup>
                    </Col>

                    <Col sm={4}>
                        <Input type="search"
                               placeholder="Search Url"
                               bsSize="small"
                               onChange={this._filterTextChanged.bind(this)}
                               ref="filterText"/>
                    </Col>
                </Row>
            </Grid>
        );
    }

    _sampleChanged() {
        var selection = DOM.findDOMNode(this.refs.selector).value;
        var har = selection ? _.find(window.samples, s => s.id === selection).har : null;

        if (har) {
            this.setState({activeHar: har});
        }
        else {
            this.setState(this._initialState());  // reset state
        }
    }

    //---------------------------------------
    // Filtering
    //---------------------------------------
    _createButton(type, label) {
        var handler = this._filterRequested.bind(this, type);
        return (
            <Button key={type}
                    bsStyle="primary"
                    active={this.state.type === type}
                    onClick={handler}>
                {label}
            </Button>
        )
    }

    _filterRequested(type, event) {

    }

    _filterTextChanged() {

    }
}

HarViewer.defaultProps = {};