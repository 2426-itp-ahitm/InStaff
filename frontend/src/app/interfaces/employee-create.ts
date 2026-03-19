export interface EmployeeCreate {
    firstname: string;
    lastname: string;
    email: string;
    telephone: string;
    birthDate: Date;
    isManager: boolean;
    roles: number[];
    hourlyWage: number;
    address: string;
}
