import {Component, inject, OnInit} from '@angular/core';
import {EmployeeAddComponent} from '../../employee/employee-add/employee-add.component';
import {EmployeeEditComponent} from '../../employee/employee-edit/employee-edit.component';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {ShiftTemplate} from '../../interfaces/shift-template';
import {ShiftTemplateServiceService} from '../shift-template-service/shift-template-service.service';
import {ShiftTemplateEditComponent} from '../shift-template-edit/shift-template-edit.component';
import {ShiftTemplateAddComponent} from '../shift-template-add/shift-template-add.component';

@Component({
  selector: 'app-shift-template-list',
  imports: [
    EmployeeAddComponent,
    EmployeeEditComponent,
    NgForOf,
    NgIf,
    ShiftTemplateEditComponent,
    ShiftTemplateAddComponent,
    NgOptimizedImage
  ],
  templateUrl: './shift-template-list.component.html',
  styleUrl: './shift-template-list.component.css'
})
export class ShiftTemplateListComponent implements OnInit {
  private shiftTemplateService: ShiftTemplateServiceService = inject(ShiftTemplateServiceService);


  shiftTemplates: ShiftTemplate[] = [];
    searchTerm: string = '';
  isEditMode: boolean = false;
  isAddMode: boolean = false;
  selectedShiftTemplate!: ShiftTemplate;

  ngOnInit() {
    //gets all Templates
    this.shiftTemplateService.getShiftTemplates();
    this.shiftTemplateService.shiftTemplates$.subscribe((data) => {
      this.shiftTemplates = data;
    })
  }

    onSearch(term: string) {
      this.searchTerm = term || '';
    }

    get filteredShiftTemplates(): ShiftTemplate[] {
      const q = this.searchTerm.trim().toLowerCase();
      if (!q) return this.shiftTemplates;
      return this.shiftTemplates.filter(t => {
        const name = (t.shiftTemplateName || '').toLowerCase();
        return name.includes(q);
      });
    }

  openAddShiftTemplate() {
    this.isAddMode = true;

  }

  openShiftTemplateEdit(sT: ShiftTemplate) {
    this.isEditMode = true;
    this.selectedShiftTemplate = sT
  }

  closeShiftTemplateEdit() {
    this.isEditMode = false;

  }

  closeShiftTemplateAdd() {
    this.isAddMode = false;
  }
}
