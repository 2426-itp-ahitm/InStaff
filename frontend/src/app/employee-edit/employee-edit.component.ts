import {Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter, inject} from '@angular/core';
import {Employee} from '../interfaces/employee';
import {NgForOf} from '@angular/common';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {FormsModule} from '@angular/forms';
import {FeedbackServiceService} from '../feedback-service/feedback-service.service';

@Component({
  selector: 'app-employee-edit',
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css'
})
export class EmployeeEditComponent implements OnInit {
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)

  @Input()  employee!: Employee;

  @ViewChild('firstNameInput') firstNameInput!: ElementRef;
  @ViewChild('lastNameInput') lastNameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('telephoneInput') telephoneInput!: ElementRef;

  @Output() closeEmpEdit = new EventEmitter<void>();


  ngOnInit() {

  }

  private getEnrichedEmployee() {

  }

  save(): void {
    const updatedEmployee: Employee = {
      ...this.employee,
      firstname: this.firstNameInput.nativeElement.value,
      lastname: this.lastNameInput.nativeElement.value,
      email: this.emailInput.nativeElement.value,
      telephone: this.telephoneInput.nativeElement.value,
      roles: this.employee.roles.map(role => ({
        ...role,
        hasRole: !!(document.getElementById(`role${role.roleId}`) as HTMLInputElement)?.checked
      }))
    };
    this.employeeService.updateEmployee(updatedEmployee);
    console.log('Saving employee:', updatedEmployee);
    this.closeEmployeeEdit()
    this.feedbackService.newFeedback({message:"SAVED EMPLOYEE", type: 'success', showFeedback: true})
  }

  closeEmployeeEdit(): void {
    this.closeEmpEdit.emit();
  }

  deleteEmployee(emp: Employee) {
    const confirmed = confirm(`Are you sure you want to delete ${emp.firstname} ${emp.lastname}?`);
    if (!confirmed) {
      return;
    }

    this.employeeService.deleteEmployee(emp.id);
    this.closeEmployeeEdit();
    this.feedbackService.newFeedback({message:"DELETED EMPLOYEE", type: 'error', showFeedback: true})

  }
}
