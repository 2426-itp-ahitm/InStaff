import { Component, OnInit, inject } from '@angular/core';
import { Employee } from '../interfaces/employee';
import { Assignment } from '../interfaces/assignment';
import { EmployeeServiceService } from '../employee/employee-service/employee-service.service';
import { AssignmentServiceService } from '../services/assignment-service/assignment-service.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [NgForOf, NgIf],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployeeId: number | null = null;
  statusMessage: string | null = null;
  assignments: Assignment[] = [];

  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  assignmentService: AssignmentServiceService = inject(AssignmentServiceService);

  ngOnInit(): void {
    this.employeeService.employees$.subscribe((data) => this.employees = data);
    this.employeeService.getEmployees();
  }

  selectEmployee(id: string) {
    const parsed = Number(id);
    this.selectedEmployeeId = isNaN(parsed) ? null : parsed;
    if (this.selectedEmployeeId) {
      this.assignmentService.getAssignmentsForEmployee(this.selectedEmployeeId).subscribe({
        next: (data) => { this.assignments = data; },
        error: () => { this.assignments = []; this.statusMessage = 'Fehler beim Laden der Zuweisungen.' }
      });
    } else {
      this.assignments = [];
    }
  }

  acceptAssignment(a: Assignment) {
    if (!this.selectedEmployeeId) return;
    if (!confirm(`Zuweisung ${a.id} akzeptieren?`)) return;
    this.assignmentService.confirmAssignment(a.id).subscribe({
      next: () => {
        a.confirmed = true;
        this.statusMessage = `Zuweisung ${a.id} akzeptiert.`;
      },
      error: () => { this.statusMessage = 'Fehler beim Akzeptieren.' }
    });
  }

  declineAssignment(a: Assignment) {
    if (!this.selectedEmployeeId) return;
    if (!confirm(`Zuweisung ${a.id} ablehnen?`)) return;
    this.assignmentService.declineAssignment(a.id).subscribe({
      next: () => {
        a.confirmed = false;
        this.statusMessage = `Zuweisung ${a.id} abgelehnt.`;
      },
      error: () => { this.statusMessage = 'Fehler beim Ablehnen.' }
    });
  }


  clearMessage() { this.statusMessage = null; }

}
