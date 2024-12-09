import { Shift } from '../../models/shift'
import { Employee } from '../../models/employee'

const BASE_URL = '/api'

export async function loadShiftDetailed(shift_id: number): Promise<Employee[]> {
   const shiftResponse = await fetch(`${BASE_URL}/shifts/${shift_id}`)
   const shift: Shift = await shiftResponse.json()

   console.log('shift is', shift);
   
   //const employees: Employee[] = await Promise.all(employeeFetchPromises)
   return []
}