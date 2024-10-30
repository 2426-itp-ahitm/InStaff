import { Employee } from "src/models/employee";

const BASE_URL = "http://localhost:3000"

export async function loadAllEmployees(){   
   const response = await fetch(`${BASE_URL}/employees`)
   const employees: Employee[] = await response.json()
   
   return employees
}
