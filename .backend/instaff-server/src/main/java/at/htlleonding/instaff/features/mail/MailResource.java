/*
package at.htlleonding.instaff.features.mail;

import at.htlleonding.instaff.features.assignment.Assignment;
import at.htlleonding.instaff.features.assignment.AssignmentMapper;
import at.htlleonding.instaff.features.assignment.AssignmentRepository;
import at.htlleonding.instaff.features.employee.Employee;
import at.htlleonding.instaff.features.employee.EmployeeRepository;
import at.htlleonding.instaff.features.role.Role;
import at.htlleonding.instaff.features.shift.Shift;
import at.htlleonding.instaff.features.shift.ShiftRepository;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import io.smallrye.common.annotation.Blocking;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.time.format.DateTimeFormatter;

@Path("/mail")
public class MailResource {

    @Inject
    Mailer mailer;
    @Inject
    AssignmentRepository assignmentRepository;
    @Inject
    AssignmentMapper assignmentMapper;

    @PUT
    @Path("/{assignmentId}")
    public Response send(@PathParam("assignmentId") Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId);
        Employee employee = assignment.getEmployee();
        Shift shift = assignment.getShift();
        Role role = assignment.getRole();
        DateTimeFormatter formatterStart = DateTimeFormatter.ofPattern("dd.MM.yyyy 'from' HH:mm");
        DateTimeFormatter formatterEnd = DateTimeFormatter.ofPattern("HH:mm");

        String message = String.format("""
        <h1>You have been added to a Shift on %s to %s as %s on Instaff</h1>
                <a href="http://localhost:4200/#/shift-confirmation?assignmentId=%d"\s
                       style="display: inline-block; padding: 10px 20px; font-size: 16px;\s
                              color: white; background-color: #007BFF; text-decoration: none;\s
                              border-radius: 5px; text-align: center;">
                        View Assignment
                    </a>
        """, shift.getStartTime().format(formatterStart), shift.getEndTime().format(formatterEnd), role.getRoleName(), assignmentId);

        sendEmail(employee.getEmail(), "Shift Confirmation", message);
        return Response.ok().build();
    }

    @PUT
    @Path("/confirm/{assignmentId}")
    public Response confirm(@PathParam("assignmentId") Long assignmentId) {
        assignmentRepository.setConfirmed(true, assignmentId);
        Assignment assignment = assignmentRepository.findById(assignmentId);
        return Response.ok(assignmentMapper.toResource(assignment)).build();
    }

    @PUT
    @Path("/decline/{assignmentId}")
    public Response decline(@PathParam("assignmentId") Long assignmentId) {
        assignmentRepository.setConfirmed(false, assignmentId);
        Assignment assignment = assignmentRepository.findById(assignmentId);
        return Response.ok(assignmentMapper.toResource(assignment)).build();
    }

    public void sendEmail(String to, String subject, String body) {
        mailer.send(
                Mail.withHtml(to, subject, body)
        );
    }
}
*/