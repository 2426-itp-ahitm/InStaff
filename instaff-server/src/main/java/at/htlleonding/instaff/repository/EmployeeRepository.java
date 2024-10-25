package at.htlleonding.instaff.repository;

import at.htlleonding.instaff.model.Employee;
import at.htlleonding.instaff.model.Manager;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class EmployeeRepository {
    private Map<Integer, Employee> employees;

    public EmployeeRepository() {this.employees = new HashMap<>();}

    public Employee getEmployee(int employeeId) {
        return this.employees.get(employeeId);
    }

    public int getNextId() {
        return employees.size();
    }

    public void addEmployee (Employee employee) {
        if (this.getEmployee(employee.getEmployeeId()) != null) {
            throw new IllegalArgumentException("Employee already exists");
        }
        this.employees.put(employee.getEmployeeId(), employee);
    }

    public List<Employee> getAllEmployees() {
        return new LinkedList<>(this.employees.values());
    }
}
