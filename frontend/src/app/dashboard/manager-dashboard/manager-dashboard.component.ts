import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {CalendarComponent} from '../../essentials/calendar/calendar.component';
import {ShiftServiceService} from '../../shift/shift-service/shift-service.service';
import {Shift} from '../../interfaces/shift';
import {NewsComponent} from '../../news/news/news.component';
import {NgIf} from '@angular/common';
import {ShiftAddComponent} from '../../shift/shift-add/shift-add.component';
import {ShiftEditComponent} from '../../shift/shift-edit/shift-edit.component';
import {ShiftViewComponent} from '../../shift/shift-view/shift-view.component';
import {ManagerCalendarComponent} from '../manager-calendar/manager-calendar.component';
import {ShiftCreateDTO} from '../../interfaces/new-shift';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {KeycloakService} from 'keycloak-angular';


@Component({
  selector: 'app-manager-dashboard',
  imports: [
    CalendarComponent,
    NewsComponent,
    NgIf,
    ShiftAddComponent,
    ShiftEditComponent,
    ShiftViewComponent,
    ManagerCalendarComponent
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css'
})
export class ManagerDashboardComponent implements OnInit {
  @ViewChild(CalendarComponent) calendar!: CalendarComponent;
  shiftService: ShiftServiceService = inject(ShiftServiceService);
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  keycloackService: KeycloakService = inject(KeycloakService);

  selectedShift!: Shift;
  isEditMode: boolean = false;
  isAddMode: boolean = false;

  userName: string = "";

  ngOnInit(): void {
    this.employeeService.getEmployeeByKeycloakId(this.keycloackService.getKeycloakInstance().subject!).subscribe((emp) => {
      this.userName = emp.firstname + ' ' + emp.lastname;
    });
  }
  openShiftEditWithId(shiftId: number) {
    console.log(shiftId);
    this.shiftService.getShiftById(shiftId).subscribe((shift: Shift) => {
      this.selectedShift = shift;
      this.isEditMode = true;
    });
  }

  openShiftAdd(shift: ShiftCreateDTO) {
    console.log(shift);
    this.selectedShift = shift as unknown as Shift;
    this.isAddMode = true;
  }

  closeShiftEdit(){
    this.isEditMode = false;
  }

  closeAddShift(){
    this.isAddMode = false;
  }


}
