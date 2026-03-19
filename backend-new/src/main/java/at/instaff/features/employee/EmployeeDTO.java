package at.instaff.features.employee;

import at.instaff.features.company.CompanyDTO;
import at.instaff.features.role.RoleDTO;
import at.instaff.features.shift.ShiftDTO;

import java.time.LocalDate;
import java.util.List;

public record EmployeeDTO(
        long id,
        String keycloakUserId,
        String firstname,
        String lastname,
        String email,
        String telephone,
        LocalDate birthDate,
        boolean isManager,
        double hourlyWage,
        String address,
        Boolean isActive,
        CompanyDTO company,
        List<RoleDTO> roles
) {
    public static EmployeeDTO toResource(Employee employee) {
        return new EmployeeDTO(employee.id, employee.keycloakUserId, employee.firstName, employee.lastName, employee.email, employee.telephone, employee.birthDate,
                employee.isManager, employee.hourlyWage, employee.address, employee.isActive, CompanyDTO.toResource(employee.company),
                employee.roles.stream().map(RoleDTO::toResource).toList());
    }
}
