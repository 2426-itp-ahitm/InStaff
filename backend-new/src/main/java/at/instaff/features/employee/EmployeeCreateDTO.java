package at.instaff.features.employee;

import at.instaff.features.assignment.Assignment;
import at.instaff.features.company.Company;
import at.instaff.features.role.Role;

import java.time.LocalDate;
import java.util.List;

public record EmployeeCreateDTO(
        String firstname,
        String lastname,
        String email,
        String telephone,
        LocalDate birthDate,
        boolean isManager,
        List<Long> roles, // List of role IDs
        double hourlyWage,
        String address,
        boolean isActive
) {
    public static Employee toEmployee(EmployeeCreateDTO dto, long companyId) {
        return new Employee(dto.firstname(),
                dto.lastname(),
                dto.email(),
                dto.telephone(),
                dto.birthDate(),
                dto.hourlyWage(),
                dto.address(),
                dto.isManager(),
                Company.findById(companyId),
                Role.findByIds(dto.roles),
                dto.isActive());
    }
}
