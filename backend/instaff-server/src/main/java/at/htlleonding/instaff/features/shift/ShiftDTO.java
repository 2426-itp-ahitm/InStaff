package at.htlleonding.instaff.features.shift;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

public record ShiftDTO(
        Long id,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Long company_id,
        List<Long> employees
) {
}
