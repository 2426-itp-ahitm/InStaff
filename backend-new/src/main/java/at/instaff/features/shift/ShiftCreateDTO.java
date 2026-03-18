package at.instaff.features.shift;

import java.time.LocalDateTime;

public record ShiftCreateDTO(
        String shiftName,
        LocalDateTime startTime,
        LocalDateTime endTime
) {
}
