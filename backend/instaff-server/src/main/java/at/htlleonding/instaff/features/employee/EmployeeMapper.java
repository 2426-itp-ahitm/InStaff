package at.htlleonding.instaff.features.employee;

import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@ApplicationScoped
public class EmployeeMapper {
    public EmployeeDTO toResource(final Employee employee) {
        List<Long> roleIds = new ArrayList<>();
        if (employee.roles != null) {
            for (int i = 0; i < employee.roles.size(); i++) {
                roleIds.add(employee.roles.get(i).getId());
            }
        }
        List<Long> shiftIds = new ArrayList<>();
        if (employee.employeeShifts != null) {
            for (int i = 0; i < employee.employeeShifts.size(); i++) {
                shiftIds.add(employee.employeeShifts.get(i).getShift().getId());
            }
        }
        return new EmployeeDTO(employee.id, employee.firstname, employee.lastname,
                employee.email, employee.telephone, employee.password, employee.birthdate,
                employee.company.getId(), employee.company.getCompanyName(),
                roleIds, shiftIds);
    }
}
