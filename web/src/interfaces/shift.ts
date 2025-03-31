import { Employee } from "./employee"
import { Reservation } from "./reservation"

export interface Shift {
   id: number,
   startTime: String,
   endTime: String,
   company_id: number,
   company_name: String,
   employees: Employee[],
   reservations: Reservation[]
}