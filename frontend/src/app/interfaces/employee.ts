import {Company} from './company';
import {Role} from './role';

export interface Employee {
  id: number;
  keycloakUserId: string;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  birthDate: Date;
  isManager: boolean;
  hourlyWage: number;
  address: string;
  isActive: boolean;
  company: Company;
  roles: Role[];
}
