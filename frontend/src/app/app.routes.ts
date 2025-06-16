import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {CalendarComponent} from './calendar/calendar.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {EmployeeListComponent} from './employee-list/employee-list.component';
import {RoleListComponent} from './role-list/role-list.component';
import {ShiftTemplateListComponent} from './shift-template-list/shift-template-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent, //COMPONENT CLASS NAME
    title: 'InStaff'
  },
  {
    path: 'calendar',
    component: CalendarComponent, //COMPONENT CLASS NAME
    title: 'InStaff'
  },
  {
    path: 'team',
    component: EmployeeListComponent, //COMPONENT CLASS NAME
    title: 'InStaff'
  },
  {
    path: 'role-list',
    component: RoleListComponent, //COMPONENT CLASS NAME
    title: 'InStaff'
  },
  {
    path: 'shift-template-list',
    component: ShiftTemplateListComponent, //COMPONENT CLASS NAME
    title: 'InStaff'
  },
  {
    path: '**',
    component: NotFoundComponent, //COMPONENT CLASS NAME
    title: 'InStaff'
  },
]
