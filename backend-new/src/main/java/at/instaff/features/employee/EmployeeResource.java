package at.instaff.features.employee;

import at.instaff.features.role.Role;
import at.instaff.features.security.CustomPrincipal;
import at.instaff.features.security.CustomSecurityContext;
import at.instaff.features.security.KeycloakAdminService;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;

@Path("employees")
public class EmployeeResource {
    @Inject
    KeycloakAdminService keycloakAdminService;

    @GET
    public Response getAllEmployees(@Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        long companyId = principal.getCompanyId();

        List<Employee> employees = Employee.list("company.id", companyId);
        return Response.ok(employees.stream().map(EmployeeDTO::toResource)).build();
    }

    @GET
    @Path("/managers")
    public Response getAllManagers(@Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        List<Employee> managers = Employee.list("company.id=?1 and isManager=true", principal.getCompanyId());
        return Response.ok(managers.stream().map(EmployeeDTO::toResource)).build();
    }

    @GET
    @Path("/{id}")
    public Response getEmployee(@PathParam("id") long id, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Employee employee = Employee.find("id=?1 and company.id=?2", id, principal.getCompanyId()).singleResult();
        if (employee == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(EmployeeDTO.toResource(employee)).build();
    }

    @GET
    @Path("/keycloak/{id}")
    public Response getEmployeeByKeycloakId(@PathParam("id") String id, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Employee employee = Employee.find("keycloakUserId=?1 and company.id=?2", id, principal.getCompanyId()).singleResult();
        if (employee == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(EmployeeDTO.toResource(employee)).build();
    }

    @GET
    @Path("/role/{id}")
    public Response getEmployeesByRoleId(@PathParam("id") long id, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        List<Employee> employees = Employee.list("element(roles).id=?1 and company.id=?2", id, principal.getCompanyId());
        if (employees.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(employees.stream().map(EmployeeDTO::toResource)).build();
    }

    @GET
    @Path("/name/{name}")
    public Response getEmployeesByName(@PathParam("name") String name, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        List<Employee> employees = Employee.list("LOWER(firstName || ' ' || lastName) LIKE concat('%', ?1, '%') or " +
                "LOWER(lastName || ' ' || firstName) LIKE concat('%', ?1, '%') " +
                "and company.id = ?2", name.toLowerCase(), principal.getCompanyId());
        if (employees.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(employees.stream().map(EmployeeDTO::toResource)).build();
    }

    @POST
    @Transactional
    public Response createEmployee(EmployeeCreateDTO dto, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Employee employee = EmployeeCreateDTO.toEmployee(dto, principal.getCompanyId());

        Employee.persist(employee);
        employee.keycloakUserId = keycloakAdminService.createUser(employee);
        return Response.status(Response.Status.CREATED).entity(EmployeeDTO.toResource(employee)).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateEmployee(EmployeeCreateDTO dto, @PathParam("id") long id, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Employee employee = Employee.find("id=?1 and company.id=?2", id, principal.getCompanyId()).singleResult();
        if (employee == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        String oldEmail = employee.email;
        employee.updateEmployee(dto.firstname(), dto.lastname(), dto.email(), dto.telephone(), dto.birthDate(), dto.hourlyWage(), dto.address(), dto.isManager(), Role.findByIds(dto.roles()), dto.isActive(), dto.isSelfManaged());
        keycloakAdminService.syncEmployee(employee, oldEmail != null && !oldEmail.equals(dto.email()));

        employee.persist();
        return Response.ok(EmployeeDTO.toResource(employee)).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteEmployee(@PathParam("id") long id, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Employee employee = Employee.findById(id);
        if (employee == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (employee.company.id != principal.getCompanyId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        Employee.deleteById(id);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @PUT
    @Path("/{id}/assignrole/{roleId}")
    @Transactional
    public Response assignRoleToEmployee(@PathParam("id") long id, @PathParam("roleId") long roleId, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();

        Employee employee = Employee.find("id=?1 and company.id=?2", id, principal.getCompanyId()).singleResult();
        Role role = Role.find("id=?1 and company.id=?2", roleId, principal.getCompanyId()).singleResult();
        if (employee == null || role == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        employee.roles.add(role);
        employee.persist();
        return Response.ok(EmployeeDTO.toResource(employee)).build();
    }

    @PUT
    @Path("/{id}/removerole/{roleId}")
    @Transactional
    public Response removeRoleFromEmployee(@PathParam("id") long id, @PathParam("roleId") long roleId, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();

        Employee employee = Employee.find("id=?1 and company.id=?2", id, principal.getCompanyId()).singleResult();
        Role role = Role.find("id=?1 and company.id=?2", roleId, principal.getCompanyId()).singleResult();
        if (employee == null || role == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (!employee.roles.contains(role)) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        employee.roles.remove(role);
        employee.persist();
        return Response.ok(EmployeeDTO.toResource(employee)).build();
    }
}
