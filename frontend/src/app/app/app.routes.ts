import { Routes } from '@angular/router';
import {CalendarComponent} from '../essentials/calendar/calendar.component';
import {NotFoundComponent} from '../essentials/not-found/not-found.component';
import {EmployeeListComponent} from '../employee/employee-list/employee-list.component';
import {RoleListComponent} from '../role/role-list/role-list.component';
import {ShiftTemplateListComponent} from '../shift-template/shift-template-list/shift-template-list.component';
import {AdminComponent} from '../admin/admin.component';
import {AuthGuard} from '../guard/auth.guard';
import {ProfilComponent} from '../essentials/profil/profil.component';
import {ManagerDashboardComponent} from '../dashboard/manager-dashboard/manager-dashboard.component';
import {EmployeeDashboardComponent} from '../dashboard/employee-dashboard/employee-dashboard.component';
import {EmployeeShiftOverviewComponent} from '../dashboard/employee-shift-overview/employee-shift-overview.component';
import {RoleWikiComponent} from '../role/role-wiki/role-wiki.component';
import {EmployeeCalendarComponent} from '../dashboard/employee-calendar/employee-calendar.component';
import {PublicLayoutComponent} from '../layout/public/public-layout/public-layout.component';
import {LandingPageComponent} from '../layout/public/landing-page/landing-page.component';
import {FeaturesComponent} from '../layout/public/features/features.component';
import {AboutUsComponent} from '../layout/public/about-us/about-us.component';
import {LoginComponent} from '../layout/public/login/login';
import {PrivateLayoutComponent} from '../layout/private-layout/private-layout.component';
import {PresentationComponent} from '../layout/public/presentation/presentation.component';
import {PresentationEditComponent} from '../layout/public/presentation-edit/presentation-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'features', component: FeaturesComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'presentation', component: PresentationComponent},
      { path: 'presentation-edit', component: PresentationEditComponent},
      { path: 'login', component: LoginComponent },
    ]
  },
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      {
        path: 'home',
        component: ManagerDashboardComponent,
        title: 'InStaff',
        canActivate: [AuthGuard],
        data: {'rolesAllowed': ['user-is-manager']}
      },
      {
        path: 'emp-home',
        component: EmployeeDashboardComponent,
        title: 'InStaff',
        canActivate: [AuthGuard],
      },
      {
        path: 'calendar',
        component: CalendarComponent,
        title: 'InStaff',
        canActivate: [AuthGuard],
        data: {'rolesAllowed': ['user-is-manager']}
      },
      {
        path: 'emp-calendar',
        component: EmployeeCalendarComponent,
        title: 'InStaff',
        canActivate: [AuthGuard]
      },
      {
        path: 'emp-shift-overview',
        component: EmployeeShiftOverviewComponent,
        title: 'InStaff',
        canActivate: [AuthGuard]
      },
      {
        path: 'team',
        component: EmployeeListComponent,
        title: 'InStaff',
        canActivate: [AuthGuard],
        data: {'rolesAllowed': ['user-is-manager']}

      },
      {
        path: 'role-list',
        component: RoleListComponent,
        title: 'InStaff',
        canActivate: [AuthGuard],
        data: {'rolesAllowed': ['user-is-manager']}
      },
      {
        path: 'shift-template-list',
        component: ShiftTemplateListComponent,
        title: 'InStaff',
        canActivate: [AuthGuard],
        data: {'rolesAllowed': ['user-is-manager']}
      },
      {
        path: 'profil',
        component: ProfilComponent,
        title: 'InStaff',
        canActivate: [AuthGuard]
      },
      {
        path: 'admin',
        component: AdminComponent, //COMPONENT CLASS NAME
        title: 'InStaff',
        canActivate: [AuthGuard],
        data: {'rolesAllowed': ['user-is-manager']}
      },
      {
        path: 'wiki',
        component: RoleWikiComponent,
        title: 'InStaff',
        canActivate: [AuthGuard],
      },
    ]
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'InStaff',
  },
]
