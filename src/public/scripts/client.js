import React from 'react';
import ReactDOM from 'react-dom';

var TimerPanelContainer = require('./time-panel-components.js');

require("!style!css!index.css");

window.onload = () => {
    ReactDOM.render(
        <TimerPanelContainer url="/tasks" pollInterval={1000}/>,
        document.getElementById('content')
    );
}