import { Employee } from "../../models/employee"

const BASE_URL = "/api"
const role_id = new URLSearchParams(window.location.search).get("role_id")

export async function loadEmployeesFilteredByRole(){   
   const response = await fetch(`${BASE_URL}/employees/role/${role_id}`)
   const employees: Employee[] = await response.json()
   
   return employees
}
