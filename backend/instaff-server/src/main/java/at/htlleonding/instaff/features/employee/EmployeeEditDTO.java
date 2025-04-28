package at.htlleonding.instaff.features.employee;

import at.htlleonding.instaff.features.role.Role;

import java.time.LocalDate;
import java.util.List;

public record EmployeeEditDTO(
        String firstname,
        String lastname,
        String email,
        LocalDate birthdate,
        String telephone,
        List<Long> roles
) {
}
