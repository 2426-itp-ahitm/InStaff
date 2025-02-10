import { model } from "../../model/model"
import { Shift } from "../../interfaces/shift";

const BASE_URL = "/api"

export async function loadAllShifts() {
   const response = await fetch(`${BASE_URL}/shifts`)
   const shifts: Shift[] = await response.json()

   let employeeNames = []

   for (let i = 0; i < shifts.length; i++) {
      for (let j = 0; j < shifts[i].employees.length; j++) {
         let employeeId = shifts[i].employees[j]
         let employee = await fetch(`${BASE_URL}/employees/${employeeId}`).then(response => response.json())
         employeeNames.push(employee.firstname + " " + employee.lastname)
         
      }
      employeeNames.push(" # ")
   }

   model.shifts = shifts
   console.log("All shifts loaded", model.shifts)
}
