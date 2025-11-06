import {Component, ElementRef, ViewChild, Output, EventEmitter, OnInit, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Employee} from '../../interfaces/employee';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {Role} from '../../interfaces/role';
import {NewEmployee} from '../../interfaces/new-employee';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {EmployeeRole} from '../../interfaces/employee-role';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {RoleServiceService} from '../../role/role-service/role-service.service';

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
  roles: Role[] = [];
  addEmployeeForm!: FormGroup;

  companyService:CompanyServiceService = inject(CompanyServiceService);
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  roleService: RoleServiceService = inject(RoleServiceService);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService);

  @Output() close = new EventEmitter<void>();


  ngOnInit(): void {
    //this.roleService.getRoles();
    this.employeeService.getRoles().subscribe(r => {
      console.log(r);
      this.roles = r;
    })

    this.addEmployeeForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      birthdate: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telephone: new FormControl('', Validators.required),
      isManager: new FormControl(false),
      roles: new FormControl<EmployeeRole[]>([], Validators.required),
    });

    /*
    this.roleService.roles$.subscribe((data) => {
      this.roles = data;
      console.log(this.roles);
    });
    */
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
      console.log(newEmployee);
      this.employeeService.addNewEmployee(newEmployee);
      this.feedbackService.newFeedback({message:"Employee successfully added", type: 'success', showFeedback: true})
      this.closeAddEmployee()
    }
  }

  closeAddEmployee(): void {
    this.close.emit();
  }
}
