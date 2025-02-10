import { Employee } from "../../interfaces/employee";

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

export async function updateEmployee(employee: Employee): Promise<Employee> {
   const response = await fetch(`${BASE_URL}/employees/${employee.id}`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify(employee)
   })

   return await response.json()
}