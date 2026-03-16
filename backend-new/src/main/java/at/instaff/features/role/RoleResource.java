package at.instaff.features.role;

import at.instaff.features.company.Company;
import at.instaff.features.security.CustomPrincipal;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.List;

@Path("/roles")
public class RoleResource {

    @GET
    public Response getAllRoles(@Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        List<Role> roles = Role.list("company.id", principal.getCompanyId());
        if (roles.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(roles.stream().map(RoleDTO::toResource)).build();
    }

    @GET
    @Path("/{id}")
    public Response getRole(@PathParam("id") long id, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Role role = Role.find("id=?1 and company.id=?2", id, principal.getCompanyId()).singleResult();
        if (role == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(RoleDTO.toResource(role)).build();
    }

    @POST
    @Transactional
    public Response createRole(RoleCreateDTO dto, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Role role = new Role(dto.roleName(), dto.description(), Company.findById(principal.getCompanyId()));
        role.persist();

        return Response.status(Response.Status.CREATED).entity(RoleDTO.toResource(role)).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateRole(@PathParam("id") long id, RoleCreateDTO dto, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Role role = Role.find("id=?1 and company.id=?2", id, principal.getCompanyId()).singleResult();
        if (role == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        role.roleName = dto.roleName();
        role.description = dto.description();
        role.persist();

        return Response.ok(RoleDTO.toResource(role)).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteRole(@PathParam("id") long id, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Role role = Role.findById(id);
        if (role == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (role.company.id != principal.getCompanyId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        Role.deleteById(id);
        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
