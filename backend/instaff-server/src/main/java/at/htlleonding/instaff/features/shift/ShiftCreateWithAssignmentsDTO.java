package at.htlleonding.instaff.features.shift;

import at.htlleonding.instaff.features.assignment.AssignmentCreateDTO;

import java.util.List;

public record ShiftCreateWithAssignmentsDTO(
        ShiftCreateDTO shiftCreateDTO,
        List<AssignmentCreateDTO> assignmentCreateDTOs
) {
}
