import { Manager } from "src/models/manager";

const BASE_URL = "/api"

export async function loadAllManagers(){   
   const response = await fetch(`${BASE_URL}/managers`)
   const managers: Manager[] = await response.json()
   
   return managers
}
