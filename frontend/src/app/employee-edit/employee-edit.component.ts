import {Component, Input} from '@angular/core';
import {Employee} from '../employee';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-employee-edit',
  imports: [
    NgForOf
  ],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css'
})
export class EmployeeEditComponent {
  @Input() employee!: Employee;

}
