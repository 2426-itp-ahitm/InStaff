package at.htlleonding.instaff.features.assignment;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/assignments")
@Produces(MediaType.APPLICATION_JSON)
public class AssignmentResource {
    @Inject
    AssignmentRepository assignmentRepository;
    @Inject
    AssignmentMapper assignmentMapper;

    @GET
    public List<AssignmentDTO> all() {
        var assignments = assignmentRepository.listAll();
        return assignments
                .stream()
                .map(assignmentMapper::toResource)
                .toList();
    }

    @GET
    @Path("shift/{shift}")
    public List<AssignmentDTO> getByShift(@PathParam("shift") Long shiftId) {
        var assignments = assignmentRepository.findByShiftId(shiftId);
        return assignments
                .stream()
                .map(assignmentMapper::toResource)
                .toList();
    }
}
