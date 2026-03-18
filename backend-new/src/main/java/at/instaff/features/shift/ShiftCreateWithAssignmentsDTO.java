package at.instaff.features.shift;

import at.instaff.features.assignment.AssignmentCreateDTO;

import java.util.List;

public record ShiftCreateWithAssignmentsDTO(
        ShiftCreateDTO shiftCreateDTO,
        List<AssignmentCreateDTO> assignmentCreateDTOS
) {
}
