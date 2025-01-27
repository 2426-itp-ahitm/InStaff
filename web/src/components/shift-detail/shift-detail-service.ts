import { Shift } from '../../interfaces/shift'

const BASE_URL = '/api'

export async function loadShiftDetailed(shift_id: number): Promise<Shift> {
   if (shift_id || shift_id != 0) {
      const shiftResponse = await fetch(`${BASE_URL}/shifts/${shift_id}`)
      const shift: Shift = await shiftResponse.json()

      return shift
   } else {
      return {} as Shift
   }
}
