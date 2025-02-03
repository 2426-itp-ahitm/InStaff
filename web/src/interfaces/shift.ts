import { Employee } from "./employee"

export interface Shift {
   id: number,
   startTime: String,
   endTime: String,
   company_id: number,
   company_name: String,
   employees: Employee[]
}