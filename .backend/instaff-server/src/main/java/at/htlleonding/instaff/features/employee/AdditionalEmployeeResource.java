package at.htlleonding.instaff.features.employee;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;

@Path("/employees")
public class AdditionalEmployeeResource {
    @Inject
    EmployeeRepository employeeRepository;

    @GET
    @Path("/keycloak/{keycloakUserId}")
    public Response getEmployeeByKeycloakId(@PathParam("keycloakUserId") String keycloakUserId) {
        EmployeeDTO employeeDTO = employeeRepository.findByKcId(keycloakUserId);
        return Response.status(Response.Status.OK).entity(employeeDTO).build();
    }
}
