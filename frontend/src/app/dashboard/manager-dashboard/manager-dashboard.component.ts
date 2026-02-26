import {Component, inject, ViewChild} from '@angular/core';
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
export class ManagerDashboardComponent {
  @ViewChild(CalendarComponent) calendar!: CalendarComponent;
  shiftService: ShiftServiceService = inject(ShiftServiceService);

  selectedShift!: Shift;
  isEditMode: boolean = false;
  isAddMode: boolean = false;

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
