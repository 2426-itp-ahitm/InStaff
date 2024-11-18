package at.htlleonding.instaff.features.employee;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EmployeeMapper {
    public EmployeeDTO toResource(final Employee employee) {
        String rolesString = "";
        if (employee.roles != null) {
            for (int i = 0; i < employee.roles.size(); i++) {
                rolesString += employee.roles.get(i).getRoleName();
                if (i < employee.roles.size() - 1) {
                    rolesString += ";";
                }
            }
        }
        return new EmployeeDTO(employee.id, employee.firstname, employee.lastname, employee.email, employee.telephone, employee.password, employee.birthdate, employee.company.getId(), employee.company.getCompanyName(), rolesString);
    }
}
