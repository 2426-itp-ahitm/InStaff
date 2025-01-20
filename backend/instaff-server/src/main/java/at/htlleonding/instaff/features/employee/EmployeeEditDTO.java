package at.htlleonding.instaff.features.employee;

import java.time.LocalDate;

public record EmployeeEditDTO(
        String firstname,
        String lastname,
        String email,
        LocalDate birthdate,
        String telephone
) {
}
