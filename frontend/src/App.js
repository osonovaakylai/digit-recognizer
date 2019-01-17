import React, {Component} from 'react';
import Spinner from 'react-spinkit';
import './App.css';
import Header from "./Components/Header";
import $ from 'jquery';

class App extends Component {

    componentDidMount() {
        this.setState({
            width: this.refs.paintRegion.clientWidth,
            height: this.refs.paintRegion.clientHeight,
            top: this.refs.canvas.getBoundingClientRect().top,
            left: this.refs.canvas.getBoundingClientRect().left,
            label: 'Unknown',
            probability: 'Unknown'
        }, () => {
            const ctx = this.refs.canvas.getContext('2d');
            ctx.fillStyle = "white";
            ctx.lineJoin = ctx.lineCap = 'round';
            ctx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
        });
    }

    constructor(args) {
        super(args);
        this.state = {
            flag: false,
            previousX: 0,
            previousY: 0,
            currentX: 0,
            currentY: 0
        };
    }

    onMouseMove(event) {
        this.findXY('move', event);
    }

    onMouseDown(event) {
        this.findXY('down', event);
    }

    onMouseUp(event) {
        this.findXY('up', event);
    }

    onMouseOut(event) {
        this.findXY('out', event);
    }

    findXY(res, event) {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');

        if (res === 'down') {
            this.setState({
                previousX: this.state.currentX,
                previousY: this.state.currentY,
                currentX: event.clientX - this.state.left,
                currentY: event.clientY - this.state.top,
                flag: true
            }, function () {
                ctx.beginPath();
                ctx.fillStyle = "black";
                ctx.fillRect(this.state.currentX, this.state.currentY, 6, 6);
                ctx.closePath();
            });
        }
        if (res === 'up' || res === "out") {
            this.setState({flag: false});
        }
        if (res === 'move') {
            if (this.state.flag) {
                this.setState({
                    previousX: this.state.currentX,
                    previousY: this.state.currentY,
                    currentX: event.clientX - this.state.left,
                    currentY: event.clientY - this.state.top
                }, () => {
                    this.draw();
                });
            }
        }
    }

    draw() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(this.state.previousX, this.state.previousY);
        ctx.lineTo(this.state.currentX, this.state.currentY);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 20;
        ctx.stroke();
        ctx.closePath();
    }

    clear() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
    }

    recognize() {

        let data = this.refs.canvas.toDataURL();

        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:8080/api/v1/recognize',
            data: {image: data},
            success: (data) => {
                console.log(data.label)
                this.setState({
                    probability: data.probability,
                    label: data.label
                }, () => {

                });
            },
            error: function () {
                console.log("error");
            }
        });
    }

    render() {
        return (
            <div className="container">
                <Header/>
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">

                        <div id="loading-overlay">
                            <Spinner id="spinner-loading" style={{'display': 'none'}} name="ball-grid-pulse"
                                     ref="spinner"/>
                        </div>

                        <div className="col-md-4">
                            <div id="paintRegion" className="col-md-12 paint-region" ref="paintRegion">
                                <canvas width={this.state.width}
                                        height={this.state.height}
                                        onMouseMove={this.onMouseMove.bind(this)}
                                        onMouseDown={this.onMouseDown.bind(this)}
                                        onMouseUp={this.onMouseUp.bind(this)}
                                        onMouseOut={this.onMouseOut.bind(this)}
                                        ref="canvas"/>
                            </div>
                            <div className="tools-group">
                                <div className="btn-toolbar" role="toolbar">
                                    <div className="btn-group" role="group">
                                        <button onClick={this.recognize.bind(this)}
                                                className="btn btn-success">Recognize
                                        </button>
                                    </div>
                                    <div className="btn-group" role="group">
                                        <button onClick={this.clear.bind(this)} className="btn btn-danger">Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <h3>Predicted Number: <span className="label label-info">{this.state.label}</span></h3>
                            <h3>Predicted Probability: <span
                                className="label label-info">{this.state.probability}</span>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
