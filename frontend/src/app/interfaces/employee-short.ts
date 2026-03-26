export interface EmployeeShort {
    id: number;
    keycloakUserId: string;
    firstname: string;
    lastname: string;
    email: string;
    telephone: string;
    birthdate: Date;
    isManager: boolean;
    roles: number[];
    hourlyWage: number;
    address: string;
}
