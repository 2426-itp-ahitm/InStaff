package at.htlleonding.instaff.features.manager;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public record ManagerDTO(
        Long id,
        String firstname,
        String lastname,
        String email,
        String telephone,
        String password,
        LocalDateTime birthdate,
        Long company_id,
        String company_name
) {
}
