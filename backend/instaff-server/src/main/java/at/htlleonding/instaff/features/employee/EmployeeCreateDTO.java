package at.htlleonding.instaff.features.employee;

import at.htlleonding.instaff.features.role.Role;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record EmployeeCreateDTO(
        String firstname,
        String lastname,
        String email,
        String telephone,
        String password,
        LocalDate birthdate,
        boolean isManager,
        Long companyId, // Reference to the company
        List<Long> roles // List of role IDs
) {
}
