package at.htlleonding.instaff.features.mail;

import at.htlleonding.instaff.features.employee.Employee;
import at.htlleonding.instaff.features.employee.EmployeeRepository;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import io.smallrye.common.annotation.Blocking;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

@Path("/mail")
public class MailResource {

    @Inject
    Mailer mailer;
    @Inject
    EmployeeRepository employeeRepository;

    @GET
    @Path("/{employeeId}")
    public Response send(@PathParam("employeeId") Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId);
        sendEmail(employee.getEmail(), "Hello my Employee", "<h1>This is a Test <a href='http://localhost:8080/api/employees'>Email</a></h1>");
        return Response.ok(employeeId).build();
    }

    public void sendEmail(String to, String subject, String body) {
        mailer.send(
                Mail.withHtml(to, subject, body)
        );
    }
}
