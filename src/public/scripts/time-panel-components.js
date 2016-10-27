import React from 'react';
var $ = require('jquery-3.1.1.min');
window.jQuery = $;
window.$ = $;

module.exports = React.createClass({
    loadFromServer: function(callback) {
        $.ajax({
            url: this.props.url,
            type: 'GET',
            cache: false,
            success: function(response) {
                this.setState({
                    time: response.time,
                    timerState: response.timerState,
                    data: JSON.parse(response.records)
                });
                if (callback) {
                    callback(this.state.timerState,response.currentDescription);
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleSubmit: function(task) {
        $.ajax({
            url: this.props.url,
            type: 'POST',
            data: task,
            success: function(response) {
                this.setState({
                    currentDescription: response.currentDescription,
                    timerState: response.timerState,
                    data: JSON.parse(response.records)
                });
                switchImage(this.state.timerState);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        var callback = (function (timerState, currentDescription) {
            switchImage(timerState);
            this.setState({currentDescription: currentDescription});
        }).bind(this)
        this.loadFromServer(callback);
        setInterval(this.loadFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="tasksContainer">
                <TimeEntryForm
                    currentDescription={this.state.currentDescription}
                    time={this.state.time}
                    onSubmit={this.handleSubmit}
                />
                <TaskRecordList data={this.state.data} />
            </div>
        );
    }
});


var TimeEntryForm = React.createClass({
    getInitialState: function() {
        return {description: ''};
    },
    handleDescriptionChange: function(e) {
        this.setState({description: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var description = this.state.description.trim()||"(no description)";
        this.props.onSubmit({description: description});
        this.setState({description: ''});
    },
    render: function() {
        return (
            <div className="timeEntryForm">
                <form  method="post" onSubmit={this.handleSubmit}>
                    <div className="descriptionInputWrapper">
                        <input
                            className="descriptionInput"
                            type="text"
                            placeholder="What are you working on?"
                            value={this.props.currentDescription||this.state.description}
                            onChange={this.handleDescriptionChange}
                        />
                    </div>
                    <Timer time={this.props.time}></Timer>
                    <div className="imageWrapper">
                        <input type="image" id="timerButton"/>
                    </div>
                </form>
            </div>
        );
    }
});
function switchImage(timerState) {
    if (timerState=="on"){
        toStop();
    }
    else {
        toStart();
    }
}
function toStart(){
    document.getElementById("timerButton").src = "/img/start.png";
}
function toStop(){
    document.getElementById("timerButton").src = "/img/stop.png";
}

function formatSeconds(totalSeconds) {
    var hours   = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
    seconds = Math.round(seconds * 100) / 100

    var result = (hours < 10 ? "0" + hours : hours);
    result += ":" + (minutes < 10 ? "0" + minutes : minutes);
    result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
    return result;
}
function toDateTime(secs) {
    var t = new Date(1970, 0, 1);
    t.setMilliseconds(secs);
    return t.toUTCString();
}
var Timer = React.createClass({
    render: function() {
        return (
            <div className="timer"> {formatSeconds(this.props.time)}</div>
        );
    }
});
var TaskRecordList = React.createClass({
    render: function() {
        var data = this.props.data.slice(0).reverse();
        var recordNodes = data.map(function(record) {
            return (
                <TaskRecord key={record.id}
                            description={record.description}
                            startTime={record.startTime}
                            endTime={record.endTime}
                            duration={formatSeconds(record.duration)}>
                </TaskRecord>
            );
        });
        return (
            <div className="taskRecordList">{recordNodes}</div>
        );
    }
});
var TaskRecord = React.createClass({
    render: function() {
        return (
            <div className="taskRecord">
                <h2 className="taskDescription">{this.props.description}</h2>
                Start: {toDateTime(this.props.startTime)} <br/>
                End: {toDateTime(this.props.endTime)} <br/>
                Duration: {this.props.duration} <br/>
            </div>
        )
    }
});