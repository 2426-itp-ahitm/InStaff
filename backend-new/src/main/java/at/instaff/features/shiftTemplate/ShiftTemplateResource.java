package at.instaff.features.shiftTemplate;

import at.instaff.features.company.Company;
import at.instaff.features.role.Role;
import at.instaff.features.security.CustomPrincipal;
import at.instaff.features.templateRole.TemplateRole;
import at.instaff.features.templateRole.TemplateRoleCreateDTO;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.List;

@Path("shift-templates")
public class ShiftTemplateResource {

    @GET
    public Response getShiftTemplates(@Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();

        List<ShiftTemplate> shiftTemplates = ShiftTemplate.list("company.id", principal.getCompanyId());
        return Response.ok(shiftTemplates.stream().map(ShiftTemplateDTO::toResource)).build();
    }

    @POST
    @Transactional
    public Response createShiftTemplate(ShiftTemplateCreateDTO dto, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();

        ShiftTemplate shiftTemplate = new ShiftTemplate(dto.shiftTemplateName(), Company.findById(principal.getCompanyId()));
        shiftTemplate.persist();

        for (TemplateRoleCreateDTO templateRoleDTO : dto.templateRoles()) {
            TemplateRole templateRole = new TemplateRole(Role.findById(templateRoleDTO.roleId()), shiftTemplate, templateRoleDTO.count());
            templateRole.persist();
        }

        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateShiftTemplate(@PathParam("id") long id, ShiftTemplateCreateDTO dto, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        ShiftTemplate shiftTemplate = ShiftTemplate.findById(id);
        if (shiftTemplate == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (shiftTemplate.company.id != principal.getCompanyId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        shiftTemplate.shiftTemplateName = dto.shiftTemplateName();
        shiftTemplate.persist();

        ShiftTemplate.getEntityManager().createNativeQuery("DELETE FROM template_role WHERE shift_template_id = :id")
                .setParameter("id", shiftTemplate.id).executeUpdate();

        for (TemplateRoleCreateDTO templateRoleDTO : dto.templateRoles()) {
            TemplateRole templateRole = new TemplateRole(Role.findById(templateRoleDTO.roleId()), shiftTemplate, templateRoleDTO.count());
            templateRole.persist();
        }

        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteShiftTemplate(@PathParam("id") long id, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        ShiftTemplate shiftTemplate = ShiftTemplate.findById(id);
        if (shiftTemplate == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (shiftTemplate.company.id != principal.getCompanyId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        shiftTemplate.delete();
        return Response.status(Response.Status.NO_CONTENT).build();
    }

}
