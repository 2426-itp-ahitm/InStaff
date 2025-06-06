import {Component, ElementRef, ViewChild, Output, EventEmitter, OnInit, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Employee} from '../interfaces/employee';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {Role} from '../interfaces/role';
import {NewEmployee} from '../interfaces/new-employee';
import {CompanyServiceService} from '../company-service/company-service.service';
import {EmployeeRole} from '../interfaces/employee-role';
import {FeedbackServiceService} from '../feedback-service/feedback-service.service';

@Component({
  selector: 'app-employee-add',
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: 'employee-add.component.html',
  styleUrl: 'employee-add.component.css'
})
export class EmployeeAddComponent implements OnInit {
  addEmployeeForm!: FormGroup;

  constructor() {}
  companyService:CompanyServiceService = inject(CompanyServiceService);
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService);

  @Output() close = new EventEmitter<void>();

  roles: Role[] | null = null;

  ngOnInit(): void {
    this.addEmployeeForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      birthdate: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telephone: new FormControl('', Validators.required), // optional
      roles: new FormControl<EmployeeRole[]>([], Validators.required),
    });

    this.employeeService.getRoles().subscribe(r => {
      this.roles = r
    })
  }

  onRoleChange(roleId: number, event: Event): void {
    const rolesControl = this.addEmployeeForm.get('roles') as FormControl<number[]>;
    const checked = (event.target as HTMLInputElement).checked;
    const currentRoles = rolesControl.value ?? [];
    if (checked) {
      rolesControl.setValue([...currentRoles, roleId]);
    } else {
      rolesControl.setValue(currentRoles.filter(id => id !== roleId));
    }
  }

  save(): void {
    if (this.addEmployeeForm.valid) {
      const newEmployee: NewEmployee = this.addEmployeeForm.value;
      newEmployee.companyId = this.companyService.getCompanyId();
      this.employeeService.addNewEmployee(newEmployee);
      console.log('new employee:', newEmployee);
      this.feedbackService.newFeedback({message:"Employee successfully added", type: 'success', showFeedback: true})
      this.closeAddEmployee()
    }
  }

  closeAddEmployee(): void {
    this.close.emit();
  }
}
