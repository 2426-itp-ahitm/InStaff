package at.htlleonding.instaff.features.assignment;

public record AssignmentCreateDTO(
        Long employee,
        Long shift,
        Long role
) {
}
