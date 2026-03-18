package at.instaff.features.shift;

import at.instaff.features.assignment.AssignmentDTO;

import java.time.LocalDateTime;
import java.util.List;

public record ShiftDTO(
        Long id,
        String shiftName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        List<AssignmentDTO> assignments
) {
    public static ShiftDTO toResource(Shift shift) {
        return new ShiftDTO(shift.id, shift.shiftName, shift.startTime, shift.endTime, shift.assignments.stream().map(AssignmentDTO::toResource).toList());
    }
}
