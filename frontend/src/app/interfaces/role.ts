export interface Role {
  id: number;
  roleName: string;
  description: string;
  companyId: number;
  employees: number[]; // Array von Employee-IDs
}
