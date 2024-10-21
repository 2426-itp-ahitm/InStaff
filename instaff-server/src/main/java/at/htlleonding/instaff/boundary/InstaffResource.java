package at.htlleonding.instaff.boundary;

import at.htlleonding.instaff.model.Company;
import at.htlleonding.instaff.model.Manager;
import at.htlleonding.instaff.repository.ManagerRespository;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.io.InputStream;
import jakarta.ws.rs.core.Response;

@Path("/")
public class InstaffResource {
    ManagerRespository managerRespository = new ManagerRespository();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/company/{companyId}")
    public Response getCompany(@PathParam("companyId") int companyId) {
        Response.Status status = companyId < 0 ? Response.Status.NO_CONTENT : Response.Status.OK;
        Company company = new Company(companyId, "Test Company");
        return Response.status(status)
                .entity(company).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/manager/{managerId}")
    public Response getManager(@PathParam("managerId") int managerId) {
        Manager manager = managerRespository.getManager(managerId);
        Response.Status status = manager == null ? Response.Status.NO_CONTENT : Response.Status.OK;
        return Response.status(status)
                .entity(manager).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/createmanager/{managerName}/{password}/{companyId}")
    public Response createManager(@PathParam("managerName") String managerName, @PathParam("password") String password, @PathParam("companyId") int companyId) {
        managerRespository.addManager(new Manager(this.managerRespository.getNextId(), managerName, password, companyId));
        return Response.status(Response.Status.CREATED)
                .entity(this.managerRespository.getAllManagers()).build();
    }
}
