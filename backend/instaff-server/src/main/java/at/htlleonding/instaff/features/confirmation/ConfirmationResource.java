package at.htlleonding.instaff.features.confirmation;

import at.htlleonding.instaff.features.assignment.Assignment;
import at.htlleonding.instaff.features.assignment.AssignmentMapper;
import at.htlleonding.instaff.features.assignment.AssignmentRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;

@Path("/{companyId}/confirmation")
public class ConfirmationResource {

    @Inject
    AssignmentRepository assignmentRepository;
    @Inject
    AssignmentMapper assignmentMapper;

    @PUT
    @Path("confirm/{assignmentId}")
    public Response confirm(@PathParam("assignmentId") Long assignmentId, @PathParam("companyId") Long companyId) {
        assignmentRepository.setConfirmed(true, assignmentId, companyId);
        Assignment assignment = assignmentRepository.findById(assignmentId);
        return Response.ok(assignmentMapper.toResource(assignment)).build();
    }

    @PUT
    @Path("decline/{assignmentId}")
    public Response decline(@PathParam("assignmentId") Long assignmentId, @PathParam("companyId") Long companyId) {
        assignmentRepository.setConfirmed(false, assignmentId, companyId);
        Assignment assignment = assignmentRepository.findById(assignmentId);
        return Response.ok(assignmentMapper.toResource(assignment)).build();
    }
}
