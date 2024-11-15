package at.htlleonding.instaff.features.manager;

import java.sql.Timestamp;

public record ManagerDTO(
        Long id,
        String firstname,
        String lastname,
        String email,
        String telephone,
        String password,
        Timestamp birthdate,
        Long companyid
) {
}
