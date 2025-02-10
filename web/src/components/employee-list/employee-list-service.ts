import { model } from "../../model/model"
import { Employee } from "../../interfaces/employee"

const BASE_URL = "/api"

// Load all employees and update the model
export async function loadAllEmployees() {
    const response = await fetch(`${BASE_URL}/employees`)
    const employees: Employee[] = await response.json()
    model.employees = employees // Update the model with the fetched employees
    console.log("All employees loaded", model.employees)
}