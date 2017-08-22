import React, { Component } from 'react';
import HighCharts from 'highcharts';
import './Chart.css';

export default class Chart extends Component {
  componentDidMount() {
    const chart = HighCharts.chart('chart-container', {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Fruit Consumption'
      },
      xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
      },
      yAxis: {
        title: {
          text: 'Fruit eaten'
        }
      },
      series: [{
        name: 'Jane',
        data: [1, 0, 4]
      }, {
        name: 'John',
        data: [5, 7, 3]
      }]
    });
  }

  render() {
    return <div id="chart-container" />;
  }
}