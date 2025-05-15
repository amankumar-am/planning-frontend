// src/app/components/dashboard/count-card/count-card.component.ts

import { Component, Input } from '@angular/core';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { CommonModule } from '@angular/common';

export interface CountData {
  title: string;
  uniqueCount: number;
  url?: string;
}

@Component({
  selector: 'app-count-card',
  imports: [...MATERIAL_STANDALONE_IMPORTS, CommonModule],
  templateUrl: './count-card.component.html',
  styleUrl: './count-card.component.scss'
})
export class CountCardComponent {
  @Input() countData!: CountData;

  loading: boolean = false;
}
