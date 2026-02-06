import {Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {Employee} from '../../interfaces/employee';
import {EmployeeRole} from '../../interfaces/employee-role';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-profil',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit{
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  roleService: RoleServiceService = inject(RoleServiceService);
  keycloackService: KeycloakService = inject(KeycloakService);

  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)
  companyService: CompanyServiceService = inject(CompanyServiceService)


  @Input()  employee!: Employee;

  @ViewChild('firstNameInput') firstNameInput!: ElementRef;
  @ViewChild('lastNameInput') lastNameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('telephoneInput') telephoneInput!: ElementRef;
  @ViewChild('hourlyWageInput') hourlyWageInput!: ElementRef;



  editEmployeeForm!: FormGroup;
  employeeData!: Employee;


  ngOnInit() {
    // Initialize empty FormGroup first to avoid NG01052 error
    this.editEmployeeForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      birthdate: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telephone: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      hourlyWage: new FormControl('', Validators.required),
      isManager: new FormControl(false),
      roles: new FormControl<EmployeeRole[]>([], Validators.required),
    });

    this.employeeService.getEmployeeByKeycloakId(this.keycloackService.getKeycloakInstance().subject!).subscribe((emp) => {
      this.employee = emp;
      console.log(this.employee);
      // Update form with loaded employee data
      this.editEmployeeForm.patchValue({
        firstname: this.employee.firstname,
        lastname: this.employee.lastname,
        birthdate: this.employee.birthdate,
        email: this.employee.email,
        telephone: this.employee.telephone,
        address: this.employee.address,
        hourlyWage: this.employee.hourlyWage,
        isManager: this.employee.isManager,
        roles: this.employee.roles,
      });
    });






    this.roleService.getRoles()

  }



  save(): void {
    if (this.editEmployeeForm.valid) {
      const updatedEmp: Employee = this.editEmployeeForm.value;
      updatedEmp.id = this.employee.id;
      this.employeeService.updateEmployee(updatedEmp);
      this.feedbackService.newFeedback({message:"Employee successfully edited", type: 'success', showFeedback: true})
    }else{
    }
  }

  logout(): void {
    if (confirm('Sicher, dass du dich ausloggen willst?\nWir werden dich vermissen ):')) {
      this.keycloackService.logout()
    }
  }




}
