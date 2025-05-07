import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_STANDALONE_IMPORTS } from '../../../materialConfig/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatCheckboxChange } from '@angular/material/checkbox';

interface ReferenceFieldSchema<T> {
  field: keyof T;
  label: string;
}

@Component({
  selector: 'app-reference-field-modal',
  templateUrl: './reference-field-modal.component.html',
  styleUrls: ['./reference-field-modal.component.css'],
  standalone: true,
  imports: [...MATERIAL_STANDALONE_IMPORTS, CommonModule, FormsModule, DragDropModule]
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
  LOCAL_STORAGE_KEY = 'reference_field_visible_columns';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  constructor(
    public dialogRef: MatDialogRef<ReferenceFieldModalComponent<T>>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: { data: T[]; schema: ReferenceFieldSchema<T>[], defaultVisibleColumns: string[] }
  ) {
    this.data = dialogData.data;
    this.schema = dialogData.schema;
    this.displayedColumns = this.schema.map(col => String(col.field));
    this.filteredData = [...this.data];
    this.dataSource = new MatTableDataSource(this.data);
    const savedColumns = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    const parsed = savedColumns ? JSON.parse(savedColumns) : null;
    this.visibleColumns = parsed?.length
      ? parsed
      : dialogData.defaultVisibleColumns?.length
        ? dialogData.defaultVisibleColumns
        : this.displayedColumns;
  }
  ngOnInit(): void {
    const savedColumns = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    const parsed = savedColumns ? JSON.parse(savedColumns) : null;
    this.visibleColumns = parsed?.length ? parsed : this.displayedColumns;
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(): void {
    const filterValue = this.searchTerm.trim().toLowerCase();
    this.dataSource.filterPredicate = (item: T) => {
      return Object.values(item)
        .some(val => String(val).toLowerCase().includes(filterValue));
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
}
