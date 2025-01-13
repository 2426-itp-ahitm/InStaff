import { loadAllEmployees } from "./../components/employee-list/employee-list-service";

class EmployeeMapper {
   async loadEmployees() {
      const employees = await loadAllEmployees();
      return employees.reduce((acc, employee) => {
         acc[employee.id] = employee.firstname + ' ' + employee.lastname;
         return acc;
      }, {} as Record<number, string>);
   }

   async mapEmployeeIdsToNames(employeeIds: number[]) {
      const employeesMap = await this.loadEmployees();
      return employeeIds.map(employeeId => employeesMap[employeeId]);
   }
}

export default EmployeeMapper