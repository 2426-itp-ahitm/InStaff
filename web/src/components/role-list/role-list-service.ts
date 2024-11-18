import { Role } from "../../models/role";

const BASE_URL = "/api"

export async function loadAllRoles(): Promise<Role[]> {
   const response = await fetch(`${BASE_URL}/roles`);
   const roles: Role[] = await response.json()
   
   return roles
}
