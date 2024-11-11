import { Role } from "src/models/role";

const BASE_URL = "/api"

export async function loadAllRoles(): Promise<Role[]> {
   const response = await fetch(`${BASE_URL}/role`);
   const roles: Role[] = await response.json()
   
   return roles
}
