import { Shift } from "../../models/shift";

const BASE_URL = "/api"

export async function loadAllShifts(){   
   const response = await fetch(`${BASE_URL}/shifts`)
   const shifts: Shift[] = await response.json()
   
   return shifts
}
