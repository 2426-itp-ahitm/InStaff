export interface Role {
  id: number;
  roleName: string;
  companyId: number;
  employees: number[]; // Array von Employee-IDs
}
