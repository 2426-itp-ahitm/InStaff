import { model } from "../model/model"
import { Role } from "../interfaces/role"

const BASE_URL = "/api"

// Load all roles and update the model
export async function loadAllRoles() {
    const response = await fetch(`${BASE_URL}/roles`)
    const roles:Role[] = await response.json()
    model.roles = roles // Update the model with the fetched roles
    console.log("All roles loaded", model.roles)
   
}