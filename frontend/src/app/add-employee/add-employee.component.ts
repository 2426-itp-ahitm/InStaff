import {Component, ElementRef, ViewChild, Output, EventEmitter, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Employee} from '../employee';
import {EmployeeServiceService} from '../employee-service.service';
import {Role} from '../role';
import {NewEmployee} from '../new-employee';

@Component({
  selector: 'app-add-employee',
    imports: [
        FormsModule,
        NgForOf
    ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent implements OnInit {
  constructor(private employeeService: EmployeeServiceService) {}
  @ViewChild('firstNameInput') firstNameInput!: ElementRef;
  @ViewChild('lastNameInput') lastNameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('telephoneInput') telephoneInput!: ElementRef;

  @Output() close = new EventEmitter<void>();

  roles: Role[] | null = null;

  ngOnInit(): void {
        this.employeeService.getRoles().subscribe(r => {
          this.roles = r
        })
    }




  save(): void {
    const newEmployee: NewEmployee = {
      birthdate: '1990-01-01',
      companyId: 1,
      password: '',
      firstname: this.firstNameInput.nativeElement.value,
      lastname: this.lastNameInput.nativeElement.value,
      email: this.emailInput.nativeElement.value,
      telephone: this.telephoneInput.nativeElement.value,

      /*roles: []this.newEmployee.roles.map(role => ({
        ...role,
        hasRole: !!(document.getElementById(`role${role.roleId}`) as HTMLInputElement)?.checked
      }*/
    };
    this.employeeService.addNewEmployee(newEmployee);
    console.log('new employee:', newEmployee);
    this.closeAddEmployee()
  }

  closeAddEmployee(): void {
    this.close.emit();
  }
}
