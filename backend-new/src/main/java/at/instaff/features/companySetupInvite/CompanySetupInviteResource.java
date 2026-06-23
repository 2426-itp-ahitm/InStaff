package at.instaff.features.companySetupInvite;

import at.instaff.features.security.CustomPrincipal;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/company-setup")
public class CompanySetupInviteResource {
    @GET
    @Path("invites")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getInvites(@Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        return Response.ok(CompanySetupInvite.findAll().stream().map(setup -> CompanySetupDTO.toResource((CompanySetupInvite) setup)).toList()).build();
    }

    @POST
    @Transactional
    @Path("invites")
    public Response createInvite(@Context SecurityContext sc, CompanySetupDTO invite) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();

    }
}
