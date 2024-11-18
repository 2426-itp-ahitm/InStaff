package at.htlleonding.instaff.features.shift;

import java.sql.Timestamp;
import java.util.List;

public record ShiftDTO(
        Long id,
        Timestamp startTime,
        Timestamp endTime,
        Long company_id,
        List<Long> employees
) {
}
