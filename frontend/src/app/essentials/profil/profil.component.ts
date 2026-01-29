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
    NgForOf,
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
    this.employeeService.getEmployeeByKeycloakId(this.keycloackService.getKeycloakInstance().subject!).subscribe((emp) => {
      this.employee = emp;
      console.log(this.employee);
      this.editEmployeeForm = new FormGroup({
        firstname: new FormControl(this.employee.firstname, Validators.required),
        lastname: new FormControl(this.employee.lastname, Validators.required),
        birthdate: new FormControl(this.employee.birthdate, Validators.required),
        email: new FormControl(this.employee.email, [Validators.required, Validators.email]),
        telephone: new FormControl(this.employee.telephone, Validators.required), // optional
        address: new FormControl(this.employee.address, Validators.required),
        hourlyWage: new FormControl(this.employee.hourlyWage, Validators.required),
        isManager: new FormControl(this.employee.isManager),
        roles: new FormControl<EmployeeRole[]>(this.employee.roles, Validators.required),
      });
    });
    

    



    this.roleService.getRoles()

  }



  save(): void {
    if (this.editEmployeeForm.valid) {
      const updatedEmp: Employee = this.editEmployeeForm.value;
      updatedEmp.id = this.employee.id;
      this.employeeService.updateEmployee(updatedEmp);
      console.log(updatedEmp);
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
