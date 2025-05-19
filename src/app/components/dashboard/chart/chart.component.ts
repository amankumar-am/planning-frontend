// src/app/components/dashboard/chart/chart.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { ChartData } from '../../../services/ps1/ps1.service';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  template: `
    <div class="chart-container">
      <highcharts-chart
        [Highcharts]="Highcharts"
        [options]="highchartsOptions"
        style="width: 100%; height: 100%; display: block;"
      ></highcharts-chart>
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 100%;
      min-height: 300px;
    }
  `]
})
export class ChartComponent implements OnInit {
  @Input() chartData!: ChartData;
  Highcharts: typeof Highcharts = Highcharts;
  highchartsOptions: Highcharts.Options = {};

  constructor() { }

  ngOnInit() {
    console.log('Chart Component Initialized with data:', this.chartData);
    this.initChart();
  }

  private initChart() {
    if (!this.chartData || !this.chartData.data) {
      console.warn('No chart data provided');
      return;
    }

    // Always use column chart
    this.highchartsOptions = {
      chart: {
        type: 'column',
        style: {
          fontFamily: 'Roboto, "Helvetica Neue", sans-serif'
        },
        marginLeft: 80
      },
      title: {
        text: this.chartData.title,
        style: {
          fontSize: '16px',
          fontWeight: '500'
        }
      },
      xAxis: {
        categories: this.chartData.data.map(item => {
          if (this.chartData.title === "Stage Wise Distribution (FY)" && typeof item.name === 'number') {
            return "Stage " + item.name;
          }
          return String(item.name);
        }),
        title: {
          text: this.chartData.xAxisTitle,
          style: {
            fontSize: '14px'
          }
        },
        labels: {
          style: {
            color: '#666',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            maxWidth: 100,
            width: 100,
            display: 'block',
          },
          rotation: -60,
          align: 'right',
          step: 1,
          staggerLines: 1,
          useHTML: true,
          formatter: function () {
            const label = String(this.value);
            if (label.length > 18) {
              return `<span title='${label}'>${label.substring(0, 18)}...</span>`;
            }
            return `<span title='${label}'>${label}</span>`;
          }
        }
      },
      yAxis: {
        title: {
          text: 'Number of Records',
          style: {
            fontSize: '14px'
          }
        },
        labels: {
          style: {
            color: '#666',
            fontSize: '12px'
          }
        },
        min: 0
      },
      series: [{
        type: 'column',
        name: this.chartData.title,
        data: this.chartData.data.map(item => ({
          y: Number(item.value),
          name: String(item.name)
        })),
        dataLabels: {
          enabled: true,
          format: '{point.y}',
          style: {
            fontSize: '12px'
          }
        }
      }],
      plotOptions: {
        column: {
          pointWidth: 40,
          maxPointWidth: 60,
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            style: {
              fontSize: '12px'
            }
          }
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      tooltip: {
        headerFormat: '<span style="font-size: 12px">{point.key}</span><br/>',
        pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>',
        style: {
          fontSize: '12px'
        }
      }
    };
  }
}
