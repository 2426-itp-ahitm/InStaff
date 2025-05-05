import { model } from "../model/model"
import { Employee } from "../interfaces/employee"

const BASE_URL = "/api"

// Load all employees and update the model
export async function loadAllEmployees() {
    const response = await fetch(`${BASE_URL}/employees`)
    const employees: Employee[] = await response.json()
    model.employees = employees // Update the model with the fetched employees
    console.log("All employees loaded", model.employees)
    return employees
}

// Load employees filtered by role and update the model
export async function loadEmployeesFilteredByRole(role_name: string) { 
    const response = await fetch(`${BASE_URL}/employees/role/name/${role_name}`)
    const employees: Employee[] = await response.json()
    return employees
}

// Employee details loading function
export async function loadEmployeeDetails(employeeId: number): Promise<Employee> {
    if (employeeId || employeeId != 0) {
        const response = await fetch(`${BASE_URL}/employees/${employeeId}`)
        const employee: Employee = await response.json()
        
        return employee
    } else {
        return {} as Employee
    }
}

// Update employee details
export async function updateEmployee(employee: Employee): Promise<Employee> {
    const response = await fetch(`${BASE_URL}/employees/${employee.id}`, {
       method: "POST",
       headers: {
          "Content-Type": "application/json"
       },
       body: JSON.stringify(employee)
    })
    model.employees = model.employees.map(emp => emp.id === employee.id ? employee : emp)
    const newEmployee: Employee = await response.json()
    return newEmployee;
 }