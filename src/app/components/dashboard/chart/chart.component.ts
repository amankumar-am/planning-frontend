// src/app/components/dashboard/chart/chart.component.ts

import { Component, Input } from '@angular/core';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
@Component({
  selector: 'app-chart',
  imports: [...MATERIAL_STANDALONE_IMPORTS, CommonModule, HighchartsChartModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  @Input() chartOptions!: any; // ChartData from Ps1Service
  Highcharts: typeof Highcharts = Highcharts;
  highchartsOptions: any;
  loading = false;

  ngOnInit() {
    if (this.chartOptions) {
      this.highchartsOptions = {
        chart: { type: this.chartOptions.chartType },
        title: { text: this.chartOptions.title },
        xAxis: {
          categories: this.chartOptions.data.map((item: any) => {
            if (this.chartOptions.title === "Stage Wise Distribution (FY)" && typeof item.name === 'number') { // Check if it's stage data
              return "Stage " + item.name;
            } else {
              return String(item.name);
            }
          }),
          title: { text: this.chartOptions.xAxisTitle },
          labels: { style: { color: '#000000', fontSize: '12px' } }
        },
        yAxis: {
          title: { text: 'Number of Records' },
          labels: { style: { color: '#000000', fontSize: '12px' } }
        },
        series: [{
          name: this.chartOptions.title,
          data: this.chartOptions.data.map((item: any) => parseInt(item.value, 10)
          ),
          dataLabels: { enabled: true }
        }],
        plotOptions: {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: (event: any) => {
                  const url = this.chartOptions.data[event.point.index]?.url;
                  if (url) {
                    window.location.href = url;
                  } else {
                    console.warn('No URL available for this data point');
                  }
                }
              }
            }
          }
        }
      };
    }
  }
}
