import { loadAllEmployees } from "./../components/employee-list/employee-list-service"
import { model } from "../model/model"

class EmployeeMapper {
   async loadEmployees() {
      // Falls die Mitarbeiter bereits im Modell gespeichert sind, nutze diese
      if (model.employees.length > 0) {
         console.log("Using cached employees from the model")
         return model.employees.reduce((acc, employee) => {
            acc[employee.id] = `${employee.firstname} ${employee.lastname}`
            return acc
         }, {} as Record<number, string>)
      }

      // Andernfalls: Hole die Daten von der API und aktualisiere das Modell
      console.log("Fetching employees from the API")
      await loadAllEmployees()


      // Erstelle die Map
      return model.employees.reduce((acc, employee) => {
         acc[employee.id] = `${employee.firstname} ${employee.lastname}`
         return acc
      }, {} as Record<number, string>)
   }

   async mapEmployeeIdsToNames(employeeIds: number[]) {
      const employeesMap = await this.loadEmployees()
      return employeeIds.map(employeeId => employeesMap[employeeId])
   }
}

export default EmployeeMapper