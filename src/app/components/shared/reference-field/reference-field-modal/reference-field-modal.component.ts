// src/app/components/shared/reference-field/reference-field-modal/reference-field-modal.component.ts

import { AfterViewInit, Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_STANDALONE_IMPORTS } from '../../../materialConfig/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMenuTrigger } from '@angular/material/menu';

interface ReferenceFieldSchema<T> {
  field: keyof T;
  label: string;
}

@Component({
  selector: 'app-reference-field-modal',
  templateUrl: './reference-field-modal.component.html',
  styleUrls: ['./reference-field-modal.component.scss'],
  standalone: true,
  imports: [...MATERIAL_STANDALONE_IMPORTS, CommonModule, FormsModule, DragDropModule],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.mat-table-dense]': 'true',
  }
})
export class ReferenceFieldModalComponent<T extends object> implements AfterViewInit, OnInit {
  dataSource = new MatTableDataSource<T>([]);
  data: T[] = [];
  schema: ReferenceFieldSchema<T>[] = [];
  defaultVisibleColumns: string[] = [];
  displayedColumns: string[] = [];
  filteredData: T[] = [];
  searchTerm: string = '';
  selectedItem: T | null = null;
  visibleColumns: string[] = [];
  isFullscreen: boolean = false;
  LOCAL_STORAGE_KEY: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  constructor(
    public dialogRef: MatDialogRef<ReferenceFieldModalComponent<T>>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: {
      data: T[];
      schema: ReferenceFieldSchema<T>[];
      defaultVisibleColumns: string[];
      storageKey?: string; // optional per-instance key
    }
  ) {
    this.LOCAL_STORAGE_KEY = this.generateStorageKeyFromSchema(this.dialogData.schema);

    this.data = dialogData.data;
    this.schema = dialogData.schema;
    this.displayedColumns = this.schema.map(col => String(col.field));
    this.filteredData = [...this.data];
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit(): void {
    const savedColumns = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    const parsed = savedColumns ? JSON.parse(savedColumns) : null;

    this.visibleColumns = parsed?.length
      ? parsed.filter((col: string) => this.displayedColumns.includes(col))
      : this.dialogData.defaultVisibleColumns?.length
        ? [...this.dialogData.defaultVisibleColumns]
        : [...this.displayedColumns];
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Set default page size
    if (this.paginator) {
      this.paginator.pageSize = 15;
      this.paginator.pageSizeOptions = [15, 30, 50, 100];
    }
  }

  applyFilter(): void {
    const filterValue = this.searchTerm.trim().toLowerCase();
    this.dataSource.filterPredicate = (item: T) => {
      return Object.values(item).some(val => String(val).toLowerCase().includes(filterValue));
    };
    this.dataSource.filter = filterValue;
  }

  submitSelection(): void {
    this.dialogRef.close(this.selectedItem);
  }

  get tableColumns(): string[] {
    return ['select', ...this.visibleColumns];
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;

    const overlayPane = document.querySelector('.cdk-overlay-pane') as HTMLElement;

    if (overlayPane) {
      if (this.isFullscreen) {
        overlayPane.style.width = '100vw';
        overlayPane.style.height = '100vh';
        overlayPane.style.top = '0';
        overlayPane.style.left = '0';
        overlayPane.style.margin = '0';
        overlayPane.style.maxWidth = '100vw';
        overlayPane.style.position = 'fixed';
      } else {
        overlayPane.style.width = '90vw';
        overlayPane.style.height = '80vh';
        overlayPane.style.maxWidth = '90vw';
        overlayPane.style.position = 'static';
      }
    }
  }

  getFieldString(column: { field: keyof T }): string {
    return String(column.field);
  }

  onVisibleColumnsChange(): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.visibleColumns));
  }

  toggleColumnSafe(field: keyof T): void {
    this.toggleColumn(String(field));
    if (this.menuTrigger) {
      setTimeout(() => {
        this.menuTrigger.openMenu();
      });
    }
  }

  toggleColumn(field: string): void {
    const index = this.visibleColumns.indexOf(field);
    if (index > -1) {
      this.visibleColumns.splice(index, 1);
    } else {
      this.visibleColumns.push(field);
    }
    this.onVisibleColumnsChange();
  }

  isColumnVisible(field: keyof T): boolean {
    return this.visibleColumns.includes(String(field));
  }

  selectAllColumns(): void {
    this.visibleColumns = [...this.displayedColumns];
    this.onVisibleColumnsChange();
  }

  resetVisibleColumns(): void {
    this.visibleColumns = this.dialogData.defaultVisibleColumns?.length
      ? [...this.dialogData.defaultVisibleColumns]
      : [...this.displayedColumns];
    this.onVisibleColumnsChange();
  }

  generateStorageKeyFromSchema<T>(schema: { field: keyof T; label: string }[]): string {
    const fields = schema.map(col => col.field).sort().join(',');
    let hash = 0;
    for (let i = 0; i < fields.length; i++) {
      const char = fields.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `reference_field_visible_columns_${hash}`;
  }

  getDisplayValue(row: any, fieldName: keyof T): string {
    // Get the raw value first
    const value = row[fieldName];



    // Handle the case where we get '[object Object]' string but need to find the actual object
    if (value === '[object Object]') {
      // Try to find a related object field that might contain the actual data
      const fieldStr = String(fieldName);
      const possibleObjectFields = [
        `${fieldStr}Object`,
        `${fieldStr}Data`,
        `${fieldStr}Info`,
        fieldStr.replace(/Id$/, ''), // Remove 'Id' suffix if present
        fieldStr.replace(/Name$/, ''), // Remove 'Name' suffix if present
      ];

      for (const possibleField of possibleObjectFields) {
        if (row[possibleField] && typeof row[possibleField] === 'object') {
          return this.extractDisplayValue(row[possibleField]);
        }
      }

      // If no related object found, check if there's a similar field with 'Name' or 'Title' suffix
      const possibleNameFields = [
        `${fieldStr}Name`,
        `${fieldStr}Title`,
        `${fieldStr}NameEn`,
        `${fieldStr.replace(/([A-Z])/g, '_$1').toLowerCase()}_name`,
      ];

      for (const nameField of possibleNameFields) {
        if (row[nameField] && typeof row[nameField] === 'string') {
          return String(row[nameField]);
        }
      }

      return '[Complex Object]';
    }

    // Handle objects directly before they get stringified
    if (value && typeof value === 'object') {
      return this.extractDisplayValue(value);
    }

    return this.formatCellValue(value);
  }

  private extractDisplayValue(obj: any): string {
    // Try common display field names in priority order
    const displayFields = ['name', 'nameEn', 'title', 'label', 'description', 'text', 'displayName'];
    for (const field of displayFields) {
      if (field in obj && obj[field] !== null && obj[field] !== undefined && obj[field] !== '') {
        return String(obj[field]);
      }
    }

    // If no standard display field found, try to find any suitable string field
    const excludePatterns = ['id', 'created', 'updated', 'deleted', 'password', 'token', 'key', 'secret'];
    const stringFields = Object.keys(obj).filter(key => {
      const keyLower = key.toLowerCase();
      return (
        typeof obj[key] === 'string' &&
        obj[key] !== null &&
        obj[key] !== undefined &&
        obj[key].length > 0 &&
        !excludePatterns.some(pattern => keyLower.includes(pattern))
      );
    });

    if (stringFields.length > 0) {
      return String(obj[stringFields[0]]);
    }

    // Last resort - show field names
    return `[Object: ${Object.keys(obj).join(', ')}]`;
  }

  formatCellValue(value: any, type?: string): string {
    if (value === null || value === undefined) return '';

    // Handle the case where an object was already converted to '[object Object]' string
    if (value === '[object Object]') {
      return '[Complex Object]';
    }

    // Handle datetime strings or type 'datetime'
    if (
      type === 'datetime' ||
      (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value))
    ) {
      try {
        return new Date(value).toLocaleString();
      } catch {
        return value;
      }
    }

    // Handle date strings or type 'date'
    if (
      type === 'date' ||
      (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))
    ) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }

    // Handle object types (like selectedItem: { id, name })
    if (typeof value === 'object' && value !== null) {
      // Try common display field names in priority order
      const displayFields = ['name', 'nameEn', 'title', 'label', 'description', 'text', 'displayName'];
      for (const field of displayFields) {
        if (field in value && value[field] !== null && value[field] !== undefined && value[field] !== '') {
          return String(value[field]);
        }
      }

      // If no standard display field found, try to find any suitable string field
      const excludePatterns = ['id', 'created', 'updated', 'deleted', 'password', 'token', 'key', 'secret'];
      const stringFields = Object.keys(value).filter(key => {
        const keyLower = key.toLowerCase();
        return (
          typeof value[key] === 'string' &&
          value[key] !== null &&
          value[key] !== undefined &&
          value[key].length > 0 &&
          !excludePatterns.some(pattern => keyLower.includes(pattern))
        );
      });

      if (stringFields.length > 0) {
        return String(value[stringFields[0]]);
      }

      // Fallback: show available fields for debugging
      const availableFields = Object.keys(value).join(', ');
      return `[Object: ${availableFields}]`;
    }

    // Default fallback
    return String(value);
  }
}
