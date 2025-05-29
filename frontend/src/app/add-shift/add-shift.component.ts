import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {DateClickArg} from '@fullcalendar/interaction';
import {ShiftServiceService} from '../shift-service/shift-service.service';
import {ShiftTemplate} from '../interfaces/shift-template';

@Component({
  selector: 'app-add-shift',
    imports: [
        FormsModule,
        NgForOf,
        ReactiveFormsModule
    ],
  templateUrl: './add-shift.component.html',
  styleUrl: './add-shift.component.css'
})
export class AddShiftComponent implements OnInit {
  selectedDate: DateClickArg | null = null;
  shiftTemplates: ShiftTemplate[] = [];
  selectedShiftTemplate: ShiftTemplate | null = null;

  @ViewChild('shiftTemplateInput') shiftTemplateInput!: ElementRef;


  constructor(private shiftService:ShiftServiceService) {
  }
  ngOnInit(): void {
    this.selectedDate = this.shiftService.selectedDate

    this.shiftService.shiftTemplates$.subscribe((data) => {
      this.shiftTemplates = data;
      console.log(this.shiftTemplates);
      this.selectedShiftTemplate = this.shiftTemplates[0];
    })
    this.shiftService.getShiftTemplates();
  }

  @Output() close = new EventEmitter<void>();


  save() {

  }

  closeAddShift() {
    this.close.emit();
  }

  chooseShiftTemplate() {
    let shiftTemplateId:number = this.shiftTemplateInput.nativeElement.value;
    for (let i = 0; i < this.shiftTemplates.length; i++) {
      if(shiftTemplateId == this.shiftTemplates[i].id){
        this.selectedShiftTemplate = this.shiftTemplates[i];
      }
    }
    console.log(this.selectedShiftTemplate);
  }
}
