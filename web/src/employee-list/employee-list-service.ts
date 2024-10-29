import { Employee } from "src/models/employee";

const BASE_URL = "https:localhost:8080"

export async function loadAllEmployees(){
   const response = await fetch(`${BASE_URL}/employee`)
   const employees: Employee[] = await response.json()
   return employees
}
