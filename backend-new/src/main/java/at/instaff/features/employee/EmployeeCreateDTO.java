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
        LocalDate birthdate,
        boolean isManager,
        List<Long> roles, // List of role IDs
        double hourlyWage,
        String address
) {
    public static Employee toEmployee(EmployeeCreateDTO dto, long companyId) {
        return new Employee(dto.firstname(),
                dto.lastname(),
                dto.email(),
                dto.telephone(),
                dto.birthdate(),
                dto.hourlyWage(),
                dto.address(),
                dto.isManager(),
                Company.findById(companyId),
                Role.findByIds(dto.roles));
    }
}
