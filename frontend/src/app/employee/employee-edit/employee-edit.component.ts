import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Employee} from '../../interfaces/employee';
import {NgForOf, NgIf} from '@angular/common';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {EmployeeRole} from '../../interfaces/employee-role';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {RoleServiceService} from '../../role/role-service/role-service.service';

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
  roleService: RoleServiceService = inject(RoleServiceService);

  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)
  companyService: CompanyServiceService = inject(CompanyServiceService)


  @Input()  employee!: Employee;

  @ViewChild('firstNameInput') firstNameInput!: ElementRef;
  @ViewChild('lastNameInput') lastNameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('telephoneInput') telephoneInput!: ElementRef;
  @ViewChild('hourlyWageInput') hourlyWageInput!: ElementRef;


  @Output() closeEmpEdit = new EventEmitter<void>();

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {

    }else if (event.key === 'Escape') {
      this.closeEmployeeEdit()
    }
  }

  editEmployeeForm!: FormGroup;


  ngOnInit() {
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



    this.roleService.getRoles()

  }



  save(): void {
    if (this.editEmployeeForm.valid) {
      const updatedEmp: Employee = this.editEmployeeForm.value;
      updatedEmp.id = this.employee.id;
      this.employeeService.updateEmployee(updatedEmp);
      console.log(updatedEmp);
      this.feedbackService.newFeedback({message:"Mitarbeiter erfolgreich bearbeitet", type: 'success', showFeedback: true})
      this.closeEmployeeEdit()
    }else{
    }
  }

  onRoleChange(roleId: number, event: Event): void {
    const rolesControl = this.editEmployeeForm.get('roles') as FormControl<EmployeeRole[]>;
    const checked = (event.target as HTMLInputElement).checked;
    const currentRoles = rolesControl.value ?? [];
    console.log(currentRoles);
    if (checked) {
      currentRoles.find(role => role.roleId == roleId)!.hasRole = true
      rolesControl.setValue(currentRoles);
    } else {
      currentRoles.find(role => role.roleId == roleId)!.hasRole = false
      rolesControl.setValue(currentRoles);
    }
  }

  closeEmployeeEdit(): void {
    this.closeEmpEdit.emit();
  }

  deleteEmployee(emp: Employee) {
    const confirmed = confirm(`Bist du dir sicher dass du ${emp.firstname} ${emp.lastname} löschen willst?`);
    if (!confirmed) {
      return;
    }

    this.employeeService.deleteEmployee(emp.id);
    this.closeEmployeeEdit();
    this.feedbackService.newFeedback({message:"Mitarbeiter erfolgreich gelöscht", type: 'success', showFeedback: true})

  }
}
