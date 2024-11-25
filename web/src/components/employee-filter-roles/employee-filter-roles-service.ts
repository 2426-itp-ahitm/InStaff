import { Employee } from "../../models/employee"
const BASE_URL = "/api"
export async function loadEmployeesFilteredByRole(role_name: string) { 
   const response = await fetch(`${BASE_URL}/employees/role/name/${role_name}`)
   const employees: Employee[] = await response.json()
   return employees
}
