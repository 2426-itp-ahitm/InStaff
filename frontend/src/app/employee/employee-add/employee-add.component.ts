import {Component, Output, EventEmitter, OnInit, inject, HostListener} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {Role} from '../../interfaces/role';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {EmployeeCreate} from '../../interfaces/employee-create';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-employee-add',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage
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

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {

    }else if (event.key === 'Escape') {
      this.closeAddEmployee()
    }
  }


  ngOnInit(): void {

    this.roleService.roles$.subscribe(r => this.roles = r);
    this.roleService.getRoles();


    this.addEmployeeForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      birthdate: new FormControl('', [Validators.required, this.employeeService.birthdateValidator()]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telephone: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      hourlyWage: new FormControl('', Validators.required),
      isManager: new FormControl(false),
      isActive: new FormControl(true),
      isSelfManaged: new FormControl(true),
      roles: new FormControl<Role[]>([]),
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
      const newEmployee: EmployeeCreate = this.addEmployeeForm.value;
      console.log(newEmployee);
      this.employeeService.createEmployee(newEmployee).subscribe(
        e => {
          this.feedbackService.newFeedback({message:`${e.firstname} ${e.lastname} erfolgreich hinzugefügt`, type: 'success', showFeedback: true})
          this.closeAddEmployee()
        }
      );

    }
  }

  closeAddEmployee(): void {
    this.close.emit();
  }

  cancelAddEmployee() {
    this.addEmployeeForm.reset();
    this.closeAddEmployee()
  }
}
