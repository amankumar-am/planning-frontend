// src/app/components/dashboard/reports/chart/chart.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { ChartData } from '../../../../services/ps1/ps1.service';
import { HighchartsChartModule } from 'highcharts-angular';
import { MATERIAL_STANDALONE_IMPORTS } from '../../../materialConfig/material.module';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule, ...MATERIAL_STANDALONE_IMPORTS],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() chartData!: ChartData;
  /**
   * Chart type (e.g. 'column', 'line', 'bar', 'pie', 'area', 'scatter', etc.)
   */
  @Input() chartType: string = 'column';
  loading: boolean = true;
  Highcharts: typeof Highcharts = Highcharts;
  highchartsOptions: Highcharts.Options = {};

  constructor() { }

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    this.loading = true;
    if (!this.chartData || !this.chartData.data) {
      console.warn('No chart data provided');
      this.loading = false;
      return;
    }

    this.highchartsOptions = {
      chart: {
        type: this.chartType,
        style: {
          fontFamily: 'Roboto, "Helvetica Neue", sans-serif'
        },
        marginLeft: 80,
        marginRight: 40,
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
        type: this.chartType as any,
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
    this.loading = false;
  }
}
