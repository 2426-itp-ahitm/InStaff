export interface EmployeeCreate {
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  birthdate: Date;
  isManager: boolean;
  isActive: boolean;
  isSelfManaged: boolean;
  roles: number[];
  hourlyWage: number;
  address: string;
}
