import { Employee } from "../../models/employee"
const BASE_URL = "/api"
export async function loadEmployeesFilteredByRole(role_name: string) { 
   console.log("###################################")
   console.log("Role Name: "+role_name)
   const response = await fetch(`${BASE_URL}/employees/role/Koch`)
   const employees: Employee[] = await response.json()
   
   console.log(role_name);
   console.log(employees);
   return employees
}
