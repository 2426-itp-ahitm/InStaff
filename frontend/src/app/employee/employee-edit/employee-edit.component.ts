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
import {NgForOf, NgIf} from '@angular/common';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {EmployeeCreate} from '../../interfaces/employee-create';
import {Role} from '../../interfaces/role';
import {Employee} from '../../interfaces/employee';

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
  roles!: Role[];
  rolesWithBoolean!: { role: Role; selected: boolean }[];



  ngOnInit() {
    this.editEmployeeForm = new FormGroup({
      firstname: new FormControl(this.employee.firstname, Validators.required),
      lastname: new FormControl(this.employee.lastname, Validators.required),
      birthdate: new FormControl(this.employee.birthDate, [Validators.required, this.employeeService.birthdateValidator()]),
      email: new FormControl(this.employee.email, [Validators.required, Validators.email]),
      telephone: new FormControl(this.employee.telephone, Validators.required), // optional
      address: new FormControl(this.employee.address, Validators.required),
      hourlyWage: new FormControl(this.employee.hourlyWage, Validators.required),
      isManager: new FormControl(this.employee.isManager),
      roles: new FormControl<number[]>(this.employee.roles?.map(role => role.id) ?? [], Validators.required),
    });

    this.employeeService.getEmployeeById(this.employee.id).subscribe(e => {
      this.employee = e;
      this.editEmployeeForm.patchValue({
        firstname: this.employee.firstname,
        lastname: this.employee.lastname,
        birthdate: this.employee.birthDate,
        email: this.employee.email,
        telephone: this.employee.telephone,
        address: this.employee.address,
        hourlyWage: this.employee.hourlyWage,
        isManager: this.employee.isManager,
        roles: this.employee.roles.map(role => role.id)
      });
      this.updateRoleSelections();
    });

    this.roleService.roles$.subscribe(roles => {
      this.roles = roles;
      this.updateRoleSelections();
    });
    this.roleService.getRoles();
  }



  save(): void {
    if (this.editEmployeeForm.valid) {
      const formValue = this.editEmployeeForm.value;
      const updatedEmp: EmployeeCreate = {
        firstname: formValue.firstname,
        lastname: formValue.lastname,
        birthDate: formValue.birthdate,
        email: formValue.email,
        telephone: formValue.telephone,
        address: formValue.address,
        hourlyWage: formValue.hourlyWage,
        isManager: formValue.isManager,
        roles: formValue.roles ?? []
      };

      this.employeeService.updateEmployee(this.employee.id, updatedEmp).subscribe(
        () => {
          this.employeeService.getAllEmployees();
          this.closeEmployeeEdit();
          this.feedbackService.newFeedback({message:"Mitarbeiter erfolgreich bearbeitet", type: 'success', showFeedback: true});
        }
      );

    } else {
    }
  }

  onRoleChange(roleId: number, event: Event): void {
    const rolesControl = this.editEmployeeForm.get('roles') as FormControl<number[]>;
    const checked = (event.target as HTMLInputElement).checked;
    const currentRoles = rolesControl.value ?? [];

    const updatedRoles = checked
      ? [...new Set([...currentRoles, roleId])]
      : currentRoles.filter(id => id !== roleId);

    rolesControl.setValue(updatedRoles);

    if (this.rolesWithBoolean) {
      this.rolesWithBoolean = this.rolesWithBoolean.map(roleEntry =>
        roleEntry.role.id === roleId
          ? { ...roleEntry, selected: checked }
          : roleEntry
      );
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

    this.employeeService.deleteEmployee(emp.id).subscribe({
      next: (res) => {
        this.closeEmployeeEdit();
        this.feedbackService.newFeedback({message:"Mitarbeiter erfolgreich gelöscht", type: 'success', showFeedback: true})
      }
    });


  }

  protected employeeHasRole(r: Role): boolean {
    return this.employee.roles.some(role => role.id === r.id);
  }

  private updateRoleSelections(): void {
    if (!this.roles) {
      this.rolesWithBoolean = [];
      return;
    }

    const selectedRoleIds = new Set(this.employee.roles?.map(role => role.id) ?? []);
    this.rolesWithBoolean = this.roles.map(role => ({
      role,
      selected: selectedRoleIds.has(role.id)
    }));
  }
}
