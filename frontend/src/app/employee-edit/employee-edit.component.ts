import {Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter, inject} from '@angular/core';
import {Employee} from '../interfaces/employee';
import {NgForOf, NgIf} from '@angular/common';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FeedbackServiceService} from '../feedback-service/feedback-service.service';
import {EmployeeRole} from '../interfaces/employee-role';
import {NewEmployee} from '../interfaces/new-employee';
import {CompanyServiceService} from '../company-service/company-service.service';

@Component({
  selector: 'app-employee-edit',
  imports: [
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css'
})
export class EmployeeEditComponent implements OnInit {
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)
  companyService: CompanyServiceService = inject(CompanyServiceService)


  @Input()  employee!: Employee;

  @ViewChild('firstNameInput') firstNameInput!: ElementRef;
  @ViewChild('lastNameInput') lastNameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('telephoneInput') telephoneInput!: ElementRef;

  @Output() closeEmpEdit = new EventEmitter<void>();

  editEmployeeForm!: FormGroup;


  ngOnInit() {
    this.editEmployeeForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      birthdate: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telephone: new FormControl('', Validators.required), // optional
      roles: new FormControl<EmployeeRole[]>([], Validators.required),
    });

    this.editEmployeeForm.get('firstname')?.setValue(this.employee.firstname);
    this.editEmployeeForm.get('lastname')?.setValue(this.employee.lastname);
    this.editEmployeeForm.get('birthdate')?.setValue(this.employee.birthdate);
    this.editEmployeeForm.get('email')?.setValue(this.employee.email);
    this.editEmployeeForm.get('telephone')?.setValue(this.employee.telephone);

    this.editEmployeeForm.get('roles')?.setValue(this.employee.roles);

  }



  save(): void {
    if (this.editEmployeeForm.valid) {
      const updatedEmp: Employee = this.editEmployeeForm.value;
      updatedEmp.id = this.employee.id;
      this.employeeService.updateEmployee(updatedEmp);
      this.feedbackService.newFeedback({message:"Employee successfully edited", type: 'success', showFeedback: true})
      this.closeEmployeeEdit()
    }else{
    }
  }

  onRoleChange(roleId: number, event: Event): void {
    const rolesControl = this.editEmployeeForm.get('roles') as FormControl<number[]>;
    const checked = (event.target as HTMLInputElement).checked;
    const currentRoles = rolesControl.value ?? [];
    if (checked) {
      rolesControl.setValue([...currentRoles, roleId]);
    } else {
      rolesControl.setValue(currentRoles.filter(id => id !== roleId));
    }
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
    this.feedbackService.newFeedback({message:"Employee successfully deleted", type: 'success', showFeedback: true})

  }
}
