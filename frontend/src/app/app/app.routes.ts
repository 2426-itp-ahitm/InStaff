import { Routes } from '@angular/router';
import {HomeComponent} from '../essentials/home/home.component';
import {CalendarComponent} from '../essentials/calendar/calendar.component';
import {NotFoundComponent} from '../essentials/not-found/not-found.component';
import {EmployeeListComponent} from '../employee/employee-list/employee-list.component';
import {RoleListComponent} from '../role/role-list/role-list.component';
import {ShiftTemplateListComponent} from '../shift-template/shift-template-list/shift-template-list.component';
import {AdminComponent} from '../admin/admin.component';
import {AuthGuard} from '../guard/auth.guard';
import {ProfilComponent} from '../essentials/profil/profil.component';
import {ManagerDashboardComponent} from '../essentials/manager-dashboard/manager-dashboard.component';
import {EmployeeDashboardComponent} from '../essentials/employee-dashboard/employee-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: ManagerDashboardComponent, //COMPONENT CLASS NAME
    title: 'InStaff',
    canActivate: [AuthGuard],
    data: {'rolesAllowed': ['user-is-manager']}
  },
  {
    path: 'emp-home',
    component: EmployeeDashboardComponent, //COMPONENT CLASS NAME
    title: 'InStaff',
    canActivate: [AuthGuard],
  },
  {
    path: 'calendar',
    component: CalendarComponent, //COMPONENT CLASS NAME
    title: 'InStaff',
    canActivate: [AuthGuard]
  },
  {
    path: 'team',
    component: EmployeeListComponent, //COMPONENT CLASS NAME
    title: 'InStaff',
    canActivate: [AuthGuard]
  },
  {
    path: 'role-list',
    component: RoleListComponent, //COMPONENT CLASS NAME
    title: 'InStaff',
    canActivate: [AuthGuard]
  },
  {
    path: 'shift-template-list',
    component: ShiftTemplateListComponent, //COMPONENT CLASS NAME
    title: 'InStaff',
    canActivate: [AuthGuard]
  },
  {
    path: 'profil',
    component: ProfilComponent, //COMPONENT CLASS NAME
    title: 'InStaff',
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent, //COMPONENT CLASS NAME
    title: 'InStaff',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: NotFoundComponent, //COMPONENT CLASS NAME
    title: 'InStaff',
    canActivate: [AuthGuard]
  },
]
