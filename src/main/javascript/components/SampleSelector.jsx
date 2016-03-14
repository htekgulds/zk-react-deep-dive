import React from 'react';
import DOM from 'react-dom';

export default class SampleSelector extends React.Component {

    constructor() {
        super();

        this.state = {};
    }

    render() {

        var options = _.map(window.samples, (s) => {
            return (<option key={s.id} value={s.id}>{s.label}</option>);
        });

        return(
            <div>
                <label className="control-label" />
                <select ref="selector" className="form-control" onChange={this._sampleChanged.bind(this)}>
                    <option value="">---</option>
                    {options}
                </select>
            </div>
        );
    }

    _sampleChanged() {
        var selection = DOM.findDOMNode(this.refs.selector).value;
        var har = selection ? _.find(window.samples, s => s.id === selection).har : null;

        if (this.props.onSampleChanged) {
            this.props.onSampleChanged(har);
        }
    }
}

SampleSelector.defaultProps = {
    onSampleChanged: null
};

SampleSelector.propTypes = {
    onSampleChanged: React.PropTypes.func
};