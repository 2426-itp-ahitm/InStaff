package at.instaff.features.shift;

import at.instaff.features.assignment.AssignmentDTO;

import java.time.LocalDateTime;
import java.util.List;

public record ShiftShortDTO(
        Long id,
        String shiftName,
        LocalDateTime startTime,
        LocalDateTime endTime
) {
    public static ShiftShortDTO toResource(Shift shift) {
        return new ShiftShortDTO(shift.id, shift.shiftName, shift.startTime, shift.endTime);
    }
}
