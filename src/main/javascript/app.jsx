require('bootswatch/superhero/bootstrap.min.css');
require('./app.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import HarViewer from './components/HarViewer.jsx';

ReactDOM.render(
    <HarViewer />,
    document.getElementById('app')
);