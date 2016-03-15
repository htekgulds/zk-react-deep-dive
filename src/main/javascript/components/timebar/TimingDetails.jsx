import React from 'react';
import DOM from 'react-dom';
import formatter from '../../core/formatter';

const PropTypes = React.PropTypes;

export default class TimingDetails extends React.Component {

    constructor() {
        super();

        this.state = {};
    }

    render() {
        var {blocked, connect, dns, wait, send, receive} = this.props.timings;

        return (
            <table className="table table-condensed timing-details">
                <tbody>
                    <tr className="bg-danger">
                        <td><strong>Start</strong></td>
                        <td>{formatter.time(this.props.start)}</td>
                    </tr>
                    <tr className="timing-group">
                        <td><strong>Blocked</strong></td>
                        <td>{formatter.time(blocked)}</td>
                    </tr>
                    <tr className="timing-group">
                        <td><strong>DNS</strong></td>
                        <td>{formatter.time(dns)}</td>
                    </tr>
                    <tr className="timing-group">
                        <td><strong>Connect</strong></td>
                        <td>{formatter.time(connect)}</td>
                    </tr>
                    <tr className="timing-group-start">
                        <td><strong>Sent</strong></td>
                        <td>{formatter.time(send)}</td>
                    </tr>
                    <tr className="timing-group">
                        <td><strong>Wait</strong></td>
                        <td>{formatter.time(this.props.start)}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

TimingDetails.defaultProps = {
    timings: null,
    start: 0,
    total: 0
};