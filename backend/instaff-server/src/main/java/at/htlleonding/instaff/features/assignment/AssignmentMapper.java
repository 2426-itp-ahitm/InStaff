package at.htlleonding.instaff.features.assignment;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AssignmentMapper {
    public AssignmentDTO toResource(final Assignment assignment) {
        return new AssignmentDTO(assignment.getId(), assignment.getEmployee().getId(), assignment.getShift().getId(), assignment.getRole().getId(), assignment.getConfirmed());
    }
}
