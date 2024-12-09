import { Employee } from "../../models/employee";

const BASE_URL = "/api"

export async function loadAllEmployees(){   
   const response = await fetch(`${BASE_URL}/employees`)
   const employees: Employee[] = await response.json()
   
   return employees
}
