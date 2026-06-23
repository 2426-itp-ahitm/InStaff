package at.htlleonding.instaff.features.assignment;

public record AssignmentCreateDTO(
        Long employee,
        Long shift,
        Long role
) {
    public static boolean assignmentEmployeeCheck(AssignmentCreateDTO assignment) {
        return assignment.employee != null;
    }
}
