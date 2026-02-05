package at.htlleonding.instaff.features.employee;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EmployeeMapper {

    public EmployeeDTO toResource(final Employee employee) {
        return new EmployeeDTO(employee.id, employee.keycloakUserId, employee.firstname, employee.lastname,
                employee.email, employee.telephone, employee.birthdate, employee.isManager,
                employee.company.getId(), employee.company.getCompanyName(),
                employee.getRoleIds(), employee.getShiftIds(), employee.getHourlyWage(), employee.getAddress());
    }
}
