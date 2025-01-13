package at.htlleonding.instaff.features.employee;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EmployeeMapper {

    public EmployeeDTO toResource(final Employee employee) {
        return new EmployeeDTO(employee.id, employee.firstname, employee.lastname,
                employee.email, employee.telephone, employee.password, employee.birthdate,
                employee.company.getId(), employee.company.getCompanyName(),
                employee.getRoleIds(), employee.getShiftIds());
    }
}
