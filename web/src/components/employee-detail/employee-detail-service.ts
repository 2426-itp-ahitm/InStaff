import { Employee } from "../../models/employee";

const BASE_URL = "/api";

export async function loadEmployeeDetails(employeeId: number): Promise<Employee> {
   if (employeeId || employeeId != 0) {
      const response = await fetch(`${BASE_URL}/employees/${employeeId}`)
      const employee: Employee = await response.json()

      return employee
   } else {
      return {} as Employee
   }
}