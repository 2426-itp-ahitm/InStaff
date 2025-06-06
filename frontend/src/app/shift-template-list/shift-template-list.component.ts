import {Component, inject, OnInit} from '@angular/core';
import {EmployeeAddComponent} from '../employee-add/employee-add.component';
import {EmployeeEditComponent} from '../employee-edit/employee-edit.component';
import {NgForOf, NgIf} from '@angular/common';
import {ShiftTemplate} from '../interfaces/shift-template';
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
    ShiftTemplateAddComponent
  ],
  templateUrl: './shift-template-list.component.html',
  styleUrl: './shift-template-list.component.css'
})
export class ShiftTemplateListComponent implements OnInit {
  private shiftTemplateService: ShiftTemplateServiceService = inject(ShiftTemplateServiceService);


  shiftTemplates: ShiftTemplate[] = [];
  isEditMode: boolean = false;
  isAddMode: boolean = false;
  selectedShiftTemplate!: ShiftTemplate;

  ngOnInit() {
    //gets all Templates
    this.shiftTemplateService.getShiftTemplates();
    this.shiftTemplateService.shiftTemplates$.subscribe((data) => {
      this.shiftTemplates = data;
      console.log(this.shiftTemplates);
    })
  }

  openShiftTemplate() {

  }

  openShiftTemplateEdit(sT: ShiftTemplate) {

  }

  closeShiftTemplateEdit() {

  }

  closeShiftTemplateAdd() {

  }
}
