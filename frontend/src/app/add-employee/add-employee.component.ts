import {Component, ElementRef, ViewChild, Output, EventEmitter, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Employee} from '../interfaces/employee';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {Role} from '../interfaces/role';
import {NewEmployee} from '../interfaces/new-employee';
import {CompanyServiceService} from '../company-service/company-service.service';
import {EmployeeRole} from '../interfaces/employee-role';

@Component({
  selector: 'app-add-employee',
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeForm!: FormGroup;

  constructor(private employeeService: EmployeeServiceService, private companyService:CompanyServiceService) {}

  @Output() close = new EventEmitter<void>();

  roles: Role[] | null = null;

  ngOnInit(): void {
    this.addEmployeeForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      birthdate: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telephone: new FormControl(''), // optional
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
      this.closeAddEmployee()
    }

    /*const newEmployee: NewEmployee = {
      birthdate: '1990-01-01',
      companyId: 1,
      password: '',
      firstname: this.firstNameInput.nativeElement.value,
      lastname: this.lastNameInput.nativeElement.value,
      email: this.emailInput.nativeElement.value,
      telephone: this.telephoneInput.nativeElement.value,
      //TODO: the API Route doesnt allow roles at the moment
      /**roles: []this.newEmployee.roles.map(role => ({
        ...role,
        hasRole: !!(document.getElementById(`role${role.roleId}`) as HTMLInputElement)?.checked
      }
    };
    */

  }

  closeAddEmployee(): void {
    this.close.emit();
  }
}
