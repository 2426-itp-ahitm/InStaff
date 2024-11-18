package at.htlleonding.instaff.features.employee;

import at.htlleonding.instaff.features.company.CompanyRepository;
import at.htlleonding.instaff.features.role.Role;
import at.htlleonding.instaff.features.role.RoleRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class EmployeeMapper {

    @Inject
    CompanyRepository companyRepository;
    @Inject
    RoleRepository roleRepository;

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

    public Employee fromCreateDTO(EmployeeCreateDTO dto) {
        Employee employee = new Employee();
        employee.firstname = dto.firstname();
        employee.lastname = dto.lastname();
        employee.email = dto.email();
        employee.telephone = dto.telephone();
        employee.password = dto.password();
        employee.birthdate = dto.birthdate();

        // Map company and roles (fetch them from the database)
        employee.company = companyRepository.findById(dto.companyId());
        employee.roles = dto.roleIds().stream()
                .map(roleRepository::findById)
                .collect(Collectors.toList());

        return employee;
    }

}
