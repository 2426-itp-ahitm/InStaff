package at.htlleonding.instaff.features.role;

import at.htlleonding.instaff.features.company.CompanyRepository;
import at.htlleonding.instaff.features.employee.Employee;
import at.htlleonding.instaff.features.employee.EmployeeDTO;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.LinkedList;
import java.util.List;

@Path("{companyId}/roles")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RoleResource {
    @Inject
    RoleRepository roleRepository;
    @Inject
    RoleMapper roleMapper;
    @Inject
    CompanyRepository companyRepository;

    @GET
    public List<RoleDTO> all(@PathParam("companyId") Long companyId) {
        var roles = roleRepository.findByCompany(companyId);
        return roles
                .stream()
                .map(roleMapper::toResource)
                .toList();
    }

    @GET
    @Path("{id}")
    public Response getRoleById(@PathParam("id") Long id) {
        var role = roleRepository.findById(id);
        if (role == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        RoleDTO roleDTO = roleMapper.toResource(role);
        return Response.ok(roleDTO).build();
    }

    @GET
    @Path("company/{company}")
    public List<RoleDTO> getRoleByCompany(@PathParam("company") Long companyId) {
        var roles = roleRepository.listAll();
        if (roles == null) {
            return null;
        }
        List<Role> rolesWithCompany = new LinkedList<Role>();
        for (Role role : roles) {
            if (role.getCompany().getId().equals(companyId)) {
                rolesWithCompany.add(role);
            }
        }
        return rolesWithCompany
                .stream()
                .map(roleMapper::toResource)
                .toList();
    }

    @PUT
    @Path("update/{id}/{roleName}")
    public Response updateRole(@PathParam("roleName") String roleName, @PathParam("id") Long id) {
        Role role = roleRepository.updateRole(roleName, id);
        return Response.ok(roleMapper.toResource(role)).build();
    }

    @POST
    @Transactional
    public Response createRole(RoleCreateDTO dto) {
        // Map DTO to entity
        Role role = new Role(dto.roleName(), companyRepository.findById(dto.companyId()));

        // Persist the entity
        roleRepository.persist(role);

        // Return a response with the created entity
        return Response.status(Response.Status.CREATED)
                .entity(roleMapper.toResource(role))
                .build();
    }

    @DELETE
    @Path("remove/{id}")
    @Transactional
    public Response removeRole(@PathParam("id") Long id) {
        roleRepository.deleteById(id);

        return Response.ok().build();
    }
}
