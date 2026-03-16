package at.instaff.features.shift;

import java.time.LocalDateTime;
import java.util.List;

public record ShiftDTO(
        Long id,
        String shiftName,
        LocalDateTime startTime,
        LocalDateTime endTime
) {
    public static ShiftDTO toResource(Shift shift) {
        return new ShiftDTO(shift.id, shift.shiftName, shift.startTime, shift.endTime);
    }
}
