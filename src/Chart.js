import React, { Component } from 'react';
import HighCharts from 'highcharts';
import './Chart.css';
import SSEClient from './SSEClient';

const MAX_DATA = 200;
const MAX_LOG = 1000;

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: []
    };
  }
  componentDidMount() {
    this.chart = HighCharts.chart('chart-container', {
      chart: {
        type: 'line',
        animation: false,
      },
      title: {
        text: '가격 변동'
      },
      xAxis: {
        labels: {
          formatter: function() {
            return new Date(this.value).toISOString();
          }
        },
      },
      yAxis: {
        title: {
          text: 'Price/Bitcoin'
        }
      },
      series: [{
        name: 'RandomCoin',
        data: []
      }]
    });
    this.sse = new SSEClient(MAX_DATA);

    this.sse.addEventListener( (event, data = '') => {
      this.log(`[${event}]: ${data}`);
      if (event === 'message') {
        const serverData = JSON.parse(data);
        const series = this.chart.series[0];
        const shift = series.data.length > MAX_DATA;

        serverData.forEach((data) => series.addPoint([data.timestamp, data.value], false, shift));

        this.chart.redraw();
      }
    });

    this.sse.open();
  }

  log(log) {
    console.log(log);
    // const logs = this.state.logs.slice();
    // logs.push(log);
    // if (logs.length > MAX_LOG) {
    //   logs.shift();
    // }
    // this.setState({ logs });
  }

  closeSSESession() {
    if (this.sse) {
      this.sse.close();
    }
  }

  render() {
    return (
      <div className="body">
        <button onClick={() => this.closeSSESession()}>Close Session</button>
        <div id="chart-container" className="chart-container" />
        <ul id="logs" className="log-container">
          { this.state.logs.map(log => <li>{log}</li>) }
        </ul>
      </div>
    );
  }
}