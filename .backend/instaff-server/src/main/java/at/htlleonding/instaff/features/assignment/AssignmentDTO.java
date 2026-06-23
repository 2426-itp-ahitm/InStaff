package at.htlleonding.instaff.features.assignment;

public record AssignmentDTO(
        Long id,
        Long employee,
        Long shift,
        Long role,
        Boolean confirmed
) {
}
