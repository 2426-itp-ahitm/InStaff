package at.htlleonding.instaff.features.news;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record NewsDTO(
        long id,
        String employee_name,
        boolean confirmed,
        LocalDateTime shift_date,
        long shift_id,
        LocalDateTime date_created
) {
}
