package at.htlleonding.instaff.features.employee;

import java.time.LocalDateTime;
import java.util.List;

public record EmployeeCreateDTO(
        String firstname,
        String lastname,
        String email,
        String telephone,
        String password,
        LocalDateTime birthdate,
        Long companyId, // Reference to the company
        List<Long> roleIds // List of role IDs
) {
}
