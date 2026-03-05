import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {CalendarComponent} from '../../essentials/calendar/calendar.component';
import {NewsComponent} from '../../news/news/news.component';
import {ShiftServiceService} from '../../shift/shift-service/shift-service.service';
import {Shift} from '../../interfaces/shift';
import {EmployeeCalendarComponent} from '../employee-calendar/employee-calendar.component';
import {NgIf} from '@angular/common';
import {ShiftViewComponent} from '../../shift/shift-view/shift-view.component';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {KeycloakService} from 'keycloak-angular';
import {EmployeeShiftOverviewComponent} from '../employee-shift-overview/employee-shift-overview.component';

@Component({
  selector: 'app-employee-dashboard',
  imports: [
    CalendarComponent,
    NewsComponent,
    EmployeeCalendarComponent,
    NgIf,
    ShiftViewComponent,
    EmployeeShiftOverviewComponent
  ],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent implements OnInit {
  @ViewChild(CalendarComponent) calendar!: EmployeeCalendarComponent;
  shiftService: ShiftServiceService = inject(ShiftServiceService);
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  keycloackService: KeycloakService = inject(KeycloakService);

  selectedShift!: Shift;
  isViewMode: boolean = false;

  userName: string = "";

  ngOnInit(): void {
    this.employeeService.getEmployeeByKeycloakId(this.keycloackService.getKeycloakInstance().subject!).subscribe((emp) => {
      this.userName = emp.firstname + ' ' + emp.lastname;
      if(emp == null){
        this.userName = "bei Instaff";
      }
    });
  }

  openShiftViewWithId(shiftId: number) {
    console.log(shiftId);


    this.shiftService.getShiftById(shiftId).subscribe((shift: Shift) => {
      // delegate to calendar component to open the shift editor (guard in case ViewChild not ready)
      this.selectedShift = shift;
      this.isViewMode = true;
    });
  }

  closeShiftView(){
    this.isViewMode = false;
  }


}

