import { Employee } from "src/models/employee";
import { Shift } from "../../models/shift";

const BASE_URL = "/api"

export async function loadAllShifts(shiftId: number) {
   const response = await fetch(`${BASE_URL}/shifts`)
   const shifts: Shift[] = await response.json()

   let employeeNames = []

   for (let j = 0; j < shifts[shiftId].employees.length; j++) {
      let employeeId = shifts[shiftId].employees[j]
      let employee = await fetch(`${BASE_URL}/employees/${employeeId}`).then(response => response.json())
      employeeNames.push(employee.firstname + " " + employee.lastname)
      
   }
   for ( let shift of shifts) {
      shift.employees = employeeNames
   }

   console.log(employeeNames);
   
   return shifts
}
