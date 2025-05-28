export interface Role {
  id: number;
  roleName: string;
  company_id: number;
  employees: number[]; // Array von Employee-IDs
}
