package at.htlleonding.instaff.features.shift;

import java.time.LocalDateTime;

public record ShiftCreateDTO(
        LocalDateTime startTime,
        LocalDateTime endTime,
        Long companyId
) {
}
