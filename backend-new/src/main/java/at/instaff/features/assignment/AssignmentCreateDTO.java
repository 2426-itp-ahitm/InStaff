package at.instaff.features.assignment;

public record AssignmentCreateDTO(
        Long employeeId,
        long shiftId,
        long roleId
) {
}
