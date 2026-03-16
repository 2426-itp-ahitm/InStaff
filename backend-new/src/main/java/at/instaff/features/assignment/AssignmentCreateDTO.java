package at.instaff.features.assignment;

public record AssignmentCreateDTO(
        long employeeId,
        long shiftId,
        long roleId
) {
}
