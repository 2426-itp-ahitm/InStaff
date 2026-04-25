import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {Shift} from '../../interfaces/shift';
import {ShiftCreate} from '../../interfaces/shift-create';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {ShiftServiceService} from '../shift-service/shift-service.service';
import {Employee} from '../../interfaces/employee';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {AssignmentServiceService} from '../../services/assignment-service/assignment-service.service';
import {Assignment} from '../../interfaces/assignment';
import {Role} from '../../interfaces/role';
import {DateService} from '../../services/date-service/date.service';
import {EmployeeShort} from '../../interfaces/employee-short';
import {AssignmentStatus} from '../../interfaces/AssignmentStatus';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {AssignmentCreateSingleResponse} from '../../interfaces/assignment-create-single';

interface AssignmentGroup {
  role: Role;
  assignments: Assignment[];
}

interface BaseSaveResult {
  ok: boolean;
  action: 'shift' | 'delete' | 'update' | 'create';
  id?: number;
  tempId?: number;
  error?: unknown;
}

interface AssignmentSaveResult extends BaseSaveResult {
  assignment?: Assignment;
}

@Component({
  selector: 'app-shift-edit',
  imports: [
    FormsModule,
    NgClass,
    NgOptimizedImage
  ],
  templateUrl: './shift-edit.component.html',
  styleUrl: './shift-edit.component.css'
})
export class ShiftEditComponent implements OnInit {

  @Output('closeShiftEdit') closeShiftEdit = new EventEmitter<unknown>();

  @Input() shiftId!: number;

  companyService: CompanyServiceService = inject(CompanyServiceService);
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  shiftService: ShiftServiceService = inject(ShiftServiceService);
  roleService: RoleServiceService = inject(RoleServiceService);
  assignmentService: AssignmentServiceService = inject(AssignmentServiceService);
  dateService: DateService = inject(DateService);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService);

  shift!: Shift;
  shiftName: string = '';
  shiftStartTime!: string;
  shiftEndTime!: string;
  groupedAssignments: AssignmentGroup[] = [];
  employeesByRole: { roleId: number, employees: Employee[] }[] = [];
  roleNameMap: { [id: number]: string } = {};
  roles: Role[] = [];
  selectedNewRoleId = -1;
  somethingChanged = false;
  isSaving = false;
  duplicateEmployeeIds = new Set<number>();
  lastDeletedAssignment: Assignment | null = null;
  lastDeletedRoleGroup: AssignmentGroup | null = null;
  protected readonly AssignmentStatus = AssignmentStatus;

  private originalShiftSnapshot!: { shiftName: string; startTime: string; endTime: string };
  private originalAssignmentsSnapshot: Assignment[] = [];
  private tempAssignmentId = -1;

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && !this.isSaving) {
      this.closeEditShift();
    }
  }

  ngOnInit(): void {
    this.loadShift();
  }

  private loadShift(): void {
    this.shiftService.getShiftById(this.shiftId).subscribe({
      next: (s) => {
        this.shift = s;
        this.shiftName = s.shiftName;
        this.shiftStartTime = this.toDateTimeLocalValue(new Date(s.startTime));
        this.shiftEndTime = this.toDateTimeLocalValue(new Date(s.endTime));

        this.originalShiftSnapshot = {
          shiftName: this.shiftName,
          startTime: this.shiftStartTime,
          endTime: this.shiftEndTime
        };

        this.originalAssignmentsSnapshot = (s.assignments ?? []).map((assignment) => this.cloneAssignment(assignment));
        this.groupedAssignments = this.groupAssignments((s.assignments ?? []).map((assignment) => this.cloneAssignment(assignment)));

        this.employeesByRole = [];
        this.groupedAssignments.forEach((group) => {
          this.employeeService.getAllEmployeesByRoleId(group.role.id).subscribe({
            next: (employees) => {
              const existing = this.employeesByRole.find((entry) => entry.roleId === group.role.id);
              if (existing) {
                existing.employees = employees;
              } else {
                this.employeesByRole.push({roleId: group.role.id, employees});
              }
              this.normalizeRoleAssignments(group.role.id, employees);
              this.updateDuplicateEmployeeValidation();
            },
            error: () => {
              this.feedbackService.newFeedback({
                message: `Mitarbeiter für Rolle "${group.role.roleName}" konnten nicht geladen werden.`,
                type: 'error',
                showFeedback: true
              });
            }
          });
        });

        this.lastDeletedAssignment = null;
        this.lastDeletedRoleGroup = null;
        this.somethingChanged = false;
        this.updateDuplicateEmployeeValidation();
      },
      error: () => {
        this.feedbackService.newFeedback({
          message: 'Schichtdaten konnten nicht geladen werden.',
          type: 'error',
          showFeedback: true
        });
      }
    });

    this.roleService.getRoles();
    this.roleService.roles$.subscribe((roles) => {
      this.roles = roles;
      this.roleNameMap = roles.reduce((acc, role) => {
        acc[role.id] = role.roleName;
        return acc;
      }, {} as { [id: number]: string });
    });
  }

  somethingChangedSetTrue() {
    this.somethingChanged = true;
  }

  onShiftNameChanged(): void {
    this.somethingChangedSetTrue();
  }

  onShiftDateChanged(): void {
    this.somethingChangedSetTrue();
  }

  getRoleName(roleId: number): string {
    return this.roleNameMap[roleId] || 'Unbekannte Rolle';
  }

  getConfirmationStatus(status: AssignmentStatus | null): string {
    if (status === AssignmentStatus.CONFIRMED) {
      return 'Bestätigt';
    }
    if (status === AssignmentStatus.DECLINED) {
      return 'Abgelehnt';
    }
    if (status === AssignmentStatus.REQUESTED) {
      return 'Angefragt';
    }
    if (status === AssignmentStatus.REQUEST_DECLINED) {
      return 'Anfrage abgelehnt';
    }
    if (status === AssignmentStatus.REQUEST_CONFIRMED) {
      return 'Anfrage bestätigt';
    }
    return 'Ausstehend';
  }

  closeEditShift() {
    if (this.isSaving) {
      this.feedbackService.newFeedback({
        message: 'Speichern läuft noch. Bitte kurz warten.',
        type: 'info',
        showFeedback: true
      });
      return;
    }
    this.closeShiftEdit.emit();
  }

  removeRole(roleId: number) {
    const group = this.groupedAssignments.find((g) => g.role.id === roleId);
    if (!group) {
      this.feedbackService.newFeedback({
        message: 'Die ausgewählte Rolle wurde nicht gefunden.',
        type: 'error',
        showFeedback: true
      });
      return;
    }

    this.lastDeletedRoleGroup = {
      role: {...group.role},
      assignments: group.assignments.map((assignment) => this.cloneAssignment(assignment))
    };
    this.lastDeletedAssignment = null;

    this.groupedAssignments = this.groupedAssignments.filter((g) => g.role.id !== roleId);
    this.rebuildShiftAssignmentsFromGroups();
    this.somethingChangedSetTrue();
    this.updateDuplicateEmployeeValidation();
    this.feedbackService.newFeedback({
      message: `Rolle "${group.role.roleName}" wurde vorgemerkt gelöscht.`,
      type: 'success',
      showFeedback: true
    });
  }

  getEmployeesForRole(roleId: number): Employee[] {
    return this.employeesByRole.find((entry) => entry.roleId === roleId)?.employees ?? [];
  }

  getAssignmentEmployeeId(assignment: Assignment): number {
    return assignment.employee?.id && assignment.employee.id > 0 ? assignment.employee.id : 0;
  }

  setAssignmentEmployeeId(assignment: Assignment, employeeId: number): void {
    const currentEmployeeId = this.getAssignmentEmployeeId(assignment);

    if (employeeId === 0) {
      assignment.employee = {id: 0} as EmployeeShort;
      if (currentEmployeeId !== employeeId) {
        assignment.status = AssignmentStatus.PENDING;
      }
      this.somethingChangedSetTrue();
      this.updateDuplicateEmployeeValidation();
      return;
    }

    const roleEmployees = this.getEmployeesForRole(assignment.role.id);
    const selectedEmployee = roleEmployees.find((employee) => employee.id === employeeId);
    if (selectedEmployee) {
      assignment.employee = this.toEmployeeShort(selectedEmployee);
      if (currentEmployeeId !== employeeId) {
        assignment.status = AssignmentStatus.PENDING;
      }
      this.somethingChangedSetTrue();
      this.updateDuplicateEmployeeValidation();
      return;
    }

    this.feedbackService.newFeedback({
      message: 'Der ausgewählte Mitarbeiter ist für diese Rolle nicht verfügbar.',
      type: 'error',
      showFeedback: true
    });
  }

  isEmployeeSelectableForAssignment(assignment: Assignment, employeeId: number): boolean {
    const currentEmployeeId = this.getAssignmentEmployeeId(assignment);
    if (currentEmployeeId === employeeId) {
      return true;
    }

    return !this.collectAllAssignments().some((other) => other !== assignment && this.getAssignmentEmployeeId(other) === employeeId);
  }

  isAssignmentConflicting(assignment: Assignment): boolean {
    const employeeId = this.getAssignmentEmployeeId(assignment);
    return employeeId > 0 && this.duplicateEmployeeIds.has(employeeId);
  }

  protected removeAssignment(assignmentId: number): void {
    const assignment = this.collectAllAssignments().find((a) => a.id === assignmentId);
    if (!assignment) {
      this.feedbackService.newFeedback({
        message: 'Der Eintrag wurde nicht gefunden.',
        type: 'error',
        showFeedback: true
      });
      return;
    }

    this.lastDeletedAssignment = this.cloneAssignment(assignment);
    this.lastDeletedRoleGroup = null;

    this.groupedAssignments = this.groupedAssignments
      .map((group) => ({
        ...group,
        assignments: group.assignments.filter((a) => a.id !== assignmentId)
      }))
      .filter((group) => group.assignments.length > 0);

    this.rebuildShiftAssignmentsFromGroups();
    this.somethingChangedSetTrue();
    this.updateDuplicateEmployeeValidation();
    this.feedbackService.newFeedback({
      message: 'Eintrag wurde vorgemerkt gelöscht.',
      type: 'success',
      showFeedback: true
    });
  }

  protected addAssignmentToRole(group: AssignmentGroup): void {
    const newAssignment: Assignment = {
      id: this.tempAssignmentId--,
      status: AssignmentStatus.PENDING,
      seen: false,
      employee: {id: 0} as EmployeeShort,
      shift: {
        id: this.shift.id,
        shiftName: this.shiftName,
        startTime: this.shift.startTime,
        endTime: this.shift.endTime
      },
      role: group.role
    };

    group.assignments.push(newAssignment);
    this.rebuildShiftAssignmentsFromGroups();
    this.somethingChangedSetTrue();
    this.updateDuplicateEmployeeValidation();
    this.feedbackService.newFeedback({
      message: `Neue Position für "${group.role.roleName}" hinzugefügt.`,
      type: 'success',
      showFeedback: true
    });
  }

  getAvailableRolesForShift(): Role[] {
    const assignedRoleIds = new Set(this.groupedAssignments.map((group) => group.role.id));
    return this.roles.filter((role) => !assignedRoleIds.has(role.id));
  }

  addNewRole(): void {
    if (this.isSaving) {
      this.feedbackService.newFeedback({
        message: 'Speichern läuft noch. Bitte kurz warten.',
        type: 'info',
        showFeedback: true
      });
      return;
    }

    if (this.getAvailableRolesForShift().length === 0) {
      this.feedbackService.newFeedback({
        message: 'Alle verfügbaren Rollen sind bereits in dieser Schicht enthalten.',
        type: 'info',
        showFeedback: true
      });
      return;
    }

    const roleId = Number(this.selectedNewRoleId);
    if (!roleId || roleId < 0) {
      this.feedbackService.newFeedback({
        message: 'Bitte zuerst eine Rolle auswählen.',
        type: 'info',
        showFeedback: true
      });
      return;
    }

    const roleToAdd = this.getAvailableRolesForShift().find((role) => role.id === roleId);
    if (!roleToAdd) {
      this.feedbackService.newFeedback({
        message: 'Diese Rolle kann nicht hinzugefügt werden.',
        type: 'error',
        showFeedback: true
      });
      return;
    }

    const newGroup: AssignmentGroup = {
      role: roleToAdd,
      assignments: []
    };

    this.groupedAssignments.push(newGroup);
    this.addAssignmentToRole(newGroup);
    this.selectedNewRoleId = -1;

    this.employeeService.getAllEmployeesByRoleId(roleToAdd.id).subscribe({
      next: (employees) => {
        const existing = this.employeesByRole.find((entry) => entry.roleId === roleToAdd.id);
        if (existing) {
          existing.employees = employees;
        } else {
          this.employeesByRole.push({roleId: roleToAdd.id, employees});
        }
        this.feedbackService.newFeedback({
          message: `Rolle "${roleToAdd.roleName}" hinzugefügt.`,
          type: 'success',
          showFeedback: true
        });
      },
      error: () => {
        this.feedbackService.newFeedback({
          message: `Rolle "${roleToAdd.roleName}" wurde hinzugefügt, aber die Mitarbeiterliste konnte nicht geladen werden.`,
          type: 'error',
          showFeedback: true
        });
      }
    });
  }

  protected save() {
    if (this.isSaving) {
      this.feedbackService.newFeedback({
        message: 'Speichern läuft bereits.',
        type: 'info',
        showFeedback: true
      });
      return;
    }

    if (!this.isShiftDateValid()) {
      this.feedbackService.newFeedback({
        message: 'Endzeit muss nach der Startzeit liegen.',
        type: 'error',
        showFeedback: true
      });
      return;
    }

    this.updateDuplicateEmployeeValidation();
    if (this.duplicateEmployeeIds.size > 0) {
      this.feedbackService.newFeedback({
        message: 'Ein Mitarbeiter darf pro Schicht nur einmal eingeteilt sein. Bitte korrigieren.',
        type: 'error',
        showFeedback: true
      });
      return;
    }

    const shiftPayload: ShiftCreate = {
      shiftName: (this.shiftName ?? '').trim(),
      startTime: new Date(this.shiftStartTime),
      endTime: new Date(this.shiftEndTime)
    };

    const currentAssignments = this.collectAllAssignments();
    const operations = this.buildAssignmentOperations(currentAssignments);
    const shiftChanged = this.hasShiftBaseChanges(shiftPayload);
    const totalChanges = (shiftChanged ? 1 : 0) + operations.deleteIds.length + operations.updates.length + operations.creates.length;

    if (totalChanges === 0) {
      this.feedbackService.newFeedback({
        message: 'Keine Änderungen zum Speichern vorhanden.',
        type: 'info',
        showFeedback: true
      });
      return;
    }

    this.isSaving = true;

    this.runShiftPhase(shiftChanged, shiftPayload).subscribe((shiftResult) => {
      this.reportSingleResult(shiftResult);

      this.runDeletePhase(operations.deleteIds).subscribe((deleteResults) => {
        deleteResults.forEach((result) => this.reportSingleResult(result));

        this.runUpdatePhase(operations.updates).subscribe((updateResults) => {
          updateResults.forEach((result) => {
            this.reportSingleResult(result);
            if (result.ok && result.assignment) {
              this.replaceAssignmentById(result.id!, result.assignment);
            }
          });

          this.runCreatePhase(operations.creates).subscribe((createResults) => {
            createResults.forEach((result) => {
              this.reportSingleResult(result);
              if (result.ok && result.assignment) {
                this.replaceAssignmentById(result.tempId!, result.assignment);
              }
            });

            const allResults: BaseSaveResult[] = [
              shiftResult,
              ...deleteResults,
              ...updateResults,
              ...createResults
            ];

            const failedCount = allResults.filter((result) => !result.ok).length;
            this.isSaving = false;

            if (failedCount === 0) {
              this.feedbackService.newFeedback({
                message: 'Alle Änderungen wurden erfolgreich gespeichert.',
                type: 'success',
                showFeedback: true
              });
              this.closeEditShift();
              return;
            }

            this.feedbackService.newFeedback({
              message: `${failedCount} Änderung(en) konnten nicht gespeichert werden. Daten werden neu geladen.`,
              type: 'error',
              showFeedback: true
            });
            this.loadShift();
          });
        });
      });
    });
  }

  protected deleteShift() {
    if (this.isSaving) {
      this.feedbackService.newFeedback({
        message: 'Speichern läuft noch. Bitte kurz warten.',
        type: 'info',
        showFeedback: true
      });
      return;
    }

    this.shiftService.deleteShift(this.shift.id).subscribe({
      next: () => {
        this.closeEditShift();
        this.feedbackService.newFeedback({message: 'Schicht erfolgreich gelöscht', type: 'success', showFeedback: true});
      },
      error: () => {
        this.feedbackService.newFeedback({
          message: 'Fehler beim Löschen der Schicht. Bitte erneut versuchen.',
          type: 'error',
          showFeedback: true
        });
      }
    });
  }

  addLastDeleted() {
    if (this.lastDeletedRoleGroup) {
      const deletedGroup = this.lastDeletedRoleGroup;
      const existingGroup = this.groupedAssignments.find((group) => group.role.id === deletedGroup.role.id);

      if (existingGroup) {
        existingGroup.assignments.push(...deletedGroup.assignments.map((assignment) => this.cloneAssignment(assignment)));
      } else {
        this.groupedAssignments.push({
          role: {...deletedGroup.role},
          assignments: deletedGroup.assignments.map((assignment) => this.cloneAssignment(assignment))
        });
      }

      this.lastDeletedRoleGroup = null;
      this.rebuildShiftAssignmentsFromGroups();
      this.somethingChangedSetTrue();
      this.updateDuplicateEmployeeValidation();
      this.feedbackService.newFeedback({
        message: 'Zuletzt gelöschte Rolle wiederhergestellt',
        type: 'success',
        showFeedback: true
      });
      return;
    }

    if (!this.lastDeletedAssignment) {
      this.feedbackService.newFeedback({
        message: 'Es gibt kein zuletzt gelöschtes',
        type: 'error',
        showFeedback: true
      });
      return;
    }

    const assignmentToRestore = this.cloneAssignment(this.lastDeletedAssignment);
    const existingGroup = this.groupedAssignments.find((group) => group.role.id === assignmentToRestore.role.id);

    if (existingGroup) {
      existingGroup.assignments.push(assignmentToRestore);
    } else {
      this.groupedAssignments.push({
        role: assignmentToRestore.role,
        assignments: [assignmentToRestore]
      });
    }

    this.lastDeletedAssignment = null;
    this.rebuildShiftAssignmentsFromGroups();
    this.somethingChangedSetTrue();
    this.updateDuplicateEmployeeValidation();
    this.feedbackService.newFeedback({
      message: 'Zuletzt gelöschten Eintrag wiederhergestellt',
      type: 'success',
      showFeedback: true
    });
  }

  private runShiftPhase(shiftChanged: boolean, shiftPayload: ShiftCreate): Observable<BaseSaveResult> {
    if (!shiftChanged) {
      return of({ok: true, action: 'shift'});
    }

    return this.shiftService.updateShift(this.shift.id, shiftPayload).pipe(
      map((updatedShift) => {
        this.shift = updatedShift;
        this.shiftName = updatedShift.shiftName;
        return {ok: true, action: 'shift'} as BaseSaveResult;
      }),
      catchError((error) => of({ok: false, action: 'shift', error} as BaseSaveResult))
    );
  }

  private runDeletePhase(deleteIds: number[]): Observable<BaseSaveResult[]> {
    if (deleteIds.length === 0) {
      return of([]);
    }

    return forkJoin(deleteIds.map((id) =>
      this.assignmentService.deleteAssignment(id).pipe(
        map(() => ({ok: true, action: 'delete', id} as BaseSaveResult)),
        catchError((error) => of({ok: false, action: 'delete', id, error} as BaseSaveResult))
      )
    ));
  }

  private runUpdatePhase(updates: { assignmentId: number; payload: AssignmentCreateSingleResponse }[]): Observable<AssignmentSaveResult[]> {
    if (updates.length === 0) {
      return of([]);
    }

    return forkJoin(updates.map((update) =>
      this.assignmentService.updateAssignment(update.assignmentId, update.payload).pipe(
        map((assignment) => ({ok: true, action: 'update', id: update.assignmentId, assignment} as AssignmentSaveResult)),
        catchError((error) => of({ok: false, action: 'update', id: update.assignmentId, error} as AssignmentSaveResult))
      )
    ));
  }

  private runCreatePhase(creates: { tempId: number; payload: AssignmentCreateSingleResponse }[]): Observable<AssignmentSaveResult[]> {
    if (creates.length === 0) {
      return of([]);
    }

    return forkJoin(creates.map((create) =>
      this.assignmentService.createAssignment(create.payload).pipe(
        map((assignment) => ({ok: true, action: 'create', tempId: create.tempId, assignment} as AssignmentSaveResult)),
        catchError((error) => of({ok: false, action: 'create', tempId: create.tempId, error} as AssignmentSaveResult))
      )
    ));
  }

  private reportSingleResult(result: BaseSaveResult): void {
    if (result.ok) {
      return;
    }

    if (result.action === 'shift') {
      this.feedbackService.newFeedback({
        message: 'Schichtdaten konnten nicht gespeichert werden.',
        type: 'error',
        showFeedback: true
      });
      return;
    }

    if (result.action === 'delete') {
      this.feedbackService.newFeedback({
        message: `Zuweisung #${result.id} konnte nicht gelöscht werden.`,
        type: 'error',
        showFeedback: true
      });
      return;
    }

    if (result.action === 'update') {
      this.feedbackService.newFeedback({
        message: `Zuweisung #${result.id} konnte nicht aktualisiert werden.`,
        type: 'error',
        showFeedback: true
      });
      return;
    }

    this.feedbackService.newFeedback({
      message: 'Eine neue Zuweisung konnte nicht erstellt werden.',
      type: 'error',
      showFeedback: true
    });
  }

  private buildAssignmentOperations(currentAssignments: Assignment[]): {
    deleteIds: number[];
    updates: { assignmentId: number; payload: AssignmentCreateSingleResponse }[];
    creates: { tempId: number; payload: AssignmentCreateSingleResponse }[];
  } {
    const originalById = new Map(this.originalAssignmentsSnapshot.map((assignment) => [assignment.id, assignment]));
    const currentPersistedById = new Map(currentAssignments.filter((assignment) => assignment.id > 0).map((assignment) => [assignment.id, assignment]));

    const deleteIds = this.originalAssignmentsSnapshot
      .filter((assignment) => !currentPersistedById.has(assignment.id))
      .map((assignment) => assignment.id);

    const updates = currentAssignments
      .filter((assignment) => assignment.id > 0)
      .filter((assignment) => {
        const original = originalById.get(assignment.id);
        if (!original) {
          return false;
        }

        return this.toAssignmentPayload(original).employeeId !== this.toAssignmentPayload(assignment).employeeId ||
          this.toAssignmentPayload(original).roleId !== this.toAssignmentPayload(assignment).roleId;
      })
      .map((assignment) => ({
        assignmentId: assignment.id,
        payload: this.toAssignmentPayload(assignment)
      }));

    const creates = currentAssignments
      .filter((assignment) => assignment.id <= 0)
      .map((assignment) => ({
        tempId: assignment.id,
        payload: this.toAssignmentPayload(assignment)
      }));

    return {deleteIds, updates, creates};
  }

  private toAssignmentPayload(assignment: Assignment): AssignmentCreateSingleResponse {
    const selectedEmployeeId = this.getAssignmentEmployeeId(assignment);
    const employeeId = (selectedEmployeeId > 0 ? selectedEmployeeId : null) as AssignmentCreateSingleResponse['employeeId'];

    return {
      shiftId: this.shift.id,
      roleId: assignment.role.id,
      employeeId
    };
  }

  private hasShiftBaseChanges(currentShift: ShiftCreate): boolean {
    return currentShift.shiftName !== this.originalShiftSnapshot.shiftName ||
      this.shiftStartTime !== this.originalShiftSnapshot.startTime ||
      this.shiftEndTime !== this.originalShiftSnapshot.endTime;
  }

  private isShiftDateValid(): boolean {
    const start = new Date(this.shiftStartTime);
    const end = new Date(this.shiftEndTime);
    return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end.getTime() > start.getTime();
  }

  private updateDuplicateEmployeeValidation(): void {
    const counts = new Map<number, number>();

    this.collectAllAssignments().forEach((assignment) => {
      const employeeId = this.getAssignmentEmployeeId(assignment);
      if (employeeId <= 0) {
        return;
      }
      counts.set(employeeId, (counts.get(employeeId) ?? 0) + 1);
    });

    this.duplicateEmployeeIds = new Set(
      [...counts.entries()]
        .filter(([, count]) => count > 1)
        .map(([employeeId]) => employeeId)
    );
  }

  private collectAllAssignments(): Assignment[] {
    return this.groupedAssignments.flatMap((group) => group.assignments);
  }

  private rebuildShiftAssignmentsFromGroups(): void {
    this.shift.assignments = this.collectAllAssignments().map((assignment) => this.cloneAssignment(assignment));
  }

  private replaceAssignmentById(currentId: number, updated: Assignment): void {
    this.groupedAssignments = this.groupedAssignments.map((group) => ({
      ...group,
      assignments: group.assignments.map((assignment) => {
        if (assignment.id !== currentId) {
          return assignment;
        }
        return this.cloneAssignment(updated);
      })
    }));

    this.rebuildShiftAssignmentsFromGroups();
  }

  private groupAssignments(assignments: Assignment[]): AssignmentGroup[] {
    const groups = new Map<number, AssignmentGroup>();

    assignments.forEach((assignment) => {
      const roleId = assignment.role.id;
      const existingGroup = groups.get(roleId);

      if (existingGroup) {
        existingGroup.assignments.push(assignment);
        return;
      }

      groups.set(roleId, {
        role: assignment.role,
        assignments: [assignment]
      });
    });

    return Array.from(groups.values());
  }

  private normalizeRoleAssignments(roleId: number, roleEmployees: Employee[]): void {
    const validEmployeeIds = new Set(roleEmployees.map((employee) => employee.id));
    const targetGroup = this.groupedAssignments.find((group) => group.role.id === roleId);
    if (!targetGroup) {
      return;
    }

    targetGroup.assignments.forEach((assignment) => {
      const currentEmployeeId = assignment.employee?.id ?? 0;
      if (currentEmployeeId > 0 && !validEmployeeIds.has(currentEmployeeId)) {
        assignment.employee = {id: 0} as EmployeeShort;
      }
    });
  }

  private toEmployeeShort(employee: Employee): EmployeeShort {
    return {
      id: employee.id,
      keycloakUserId: employee.keycloakUserId,
      firstname: employee.firstname,
      lastname: employee.lastname,
      email: employee.email,
      telephone: employee.telephone,
      birthdate: employee.birthdate,
      isManager: employee.isManager,
      isActive: employee.isActive,
      isSelfManaged: employee.isSelfManaged,
      roles: employee.roles.map((role) => role.id),
      hourlyWage: employee.hourlyWage,
      address: employee.address
    };
  }

  private cloneAssignment(assignment: Assignment): Assignment {
    const employee = assignment.employee
      ? {...assignment.employee}
      : ({id: 0} as EmployeeShort);

    return {
      ...assignment,
      employee,
      role: {...assignment.role},
      shift: {...assignment.shift}
    };
  }

  private toDateTimeLocalValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
