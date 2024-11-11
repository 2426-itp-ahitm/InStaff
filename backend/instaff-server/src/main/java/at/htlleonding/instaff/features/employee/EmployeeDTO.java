package at.htlleonding.instaff.features.employee;

import java.sql.Timestamp;

public record EmployeeDTO(
        Long id,
        String firstname,
        String lastname,
        String email,
        String telephone,
        String password,
        Timestamp birthdate,
        Long companyid
) { }
