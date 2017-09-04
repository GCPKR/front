import React, { Component } from 'react';
import HighCharts from 'highcharts/highstock';
import './Chart.css';
import SSEClient from './SSEClient';

const MAX_DATA = 200;

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: []
    };
  }
  componentDidMount() {
    this.chart = HighCharts.stockChart('chart-container', {
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
      series: [
        { name: 'Prediction', data: [] },
        { name: 'Real', type: 'candlestick', data: [], tooltip: { valueDecimals: 2 } }
      ]
    });

    this.sse = new SSEClient(MAX_DATA);

    const events = {
      prediction: {
        series: this.chart.series[0],
        toPoint: data => [data.timestamp, data.value],
      },
      candle: {
        series: this.chart.series[1],
        toPoint: data => [data.timestamp, data.open, data.high, data.low, data.close],
      },
    };

    for (let eventName in events) {
      this.sse.addEventListener(eventName, (eventName, data) => {
        this.log(`${eventName}: ${data}`);
        const { series, toPoint } = events[eventName];
        const shift = series.data.length > MAX_DATA;

        data.forEach((d) => series.addPoint(toPoint(d), false, shift));

        this.chart.redraw();
      });
    }

    this.sse.open();
  }

  log(log) {
    console.log(log);
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