import {Component, inject, OnInit} from '@angular/core';
import {Employee} from '../../interfaces/employee';
import {Assignment} from '../../interfaces/assignment';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {AssignmentServiceService} from '../../services/assignment-service/assignment-service.service';
import {AssignmentStatus} from '../../interfaces/AssignmentStatus';
import {KeycloakOperationService} from '../../services/keycloak-service/keycloak.service';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {CompanyOverview} from '../../interfaces/company-overview';


@Component({
  selector: 'app-allocations',
  imports: [],
  templateUrl: './allocations.component.html',
  styleUrl: './allocations.component.css'
})
export class AllocationsComponent implements OnInit {
  employees: Employee[] = [];
  companies: CompanyOverview[] = [];
  selectedCompanyId: number | null = null;
  isInternalAdmin = false;
  statusMessage: string | null = null;
  assignments: Assignment[] = [];

  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  assignmentService: AssignmentServiceService = inject(AssignmentServiceService);
  keycloakOperationService: KeycloakOperationService = inject(KeycloakOperationService);
  companyService: CompanyServiceService = inject(CompanyServiceService);

  ngOnInit(): void {
    this.employeeService.employees$.subscribe((data) => this.employees = data);
    this.assignmentService.assignments$.subscribe((data) => this.assignments = data);

    this.isInternalAdmin = this.keycloakOperationService.getUserRoles().includes('user-is-internal-admin');

    if (this.isInternalAdmin) {
      this.companyService.getAllCompanies().subscribe((companies) => {
        this.companies = companies.filter((company) => company.companyId !== null);

        if (this.companies.length > 0 && this.companies[0].companyId !== null) {
          this.selectCompany(this.companies[0].companyId);
        }
      });
      return;
    }

    this.employeeService.getAllEmployees();
    this.assignmentService.getAssignments();
  }

  selectCompany(id: string | number) {
    const parsed = Number(id);
    this.selectedCompanyId = isNaN(parsed) ? null : parsed;

    if (!this.selectedCompanyId) {
      this.assignments = [];
      this.employees = [];
      return;
    }

    this.employeeService.getAllEmployees(this.selectedCompanyId);
    this.assignmentService.getAssignments(this.selectedCompanyId);
  }

  acceptAssignment(a: Assignment) {
    this.assignmentService.confirmAssignment(a.id, this.adminCompanyId()).subscribe({
      next: () => {
        a.status = AssignmentStatus.CONFIRMED;
        this.statusMessage = `Zuweisung ${a.id} akzeptiert.`;
      },
      error: () => { this.statusMessage = 'Fehler beim Akzeptieren.' }
    });
  }

  declineAssignment(a: Assignment) {
    this.assignmentService.declineAssignment(a.id, this.adminCompanyId()).subscribe({
      next: () => {
        a.status = AssignmentStatus.DECLINED;
        this.statusMessage = `Zuweisung ${a.id} abgelehnt.`;
      },
      error: () => { this.statusMessage = 'Fehler beim Ablehnen.' }
    });
  }


  clearMessage() { this.statusMessage = null; }

  private adminCompanyId(): number | undefined {
    return this.isInternalAdmin && this.selectedCompanyId ? this.selectedCompanyId : undefined;
  }

  protected readonly AssignmentStatus = AssignmentStatus;
}
