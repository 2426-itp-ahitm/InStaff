package at.htlleonding.instaff.features.shiftTemplate;

import at.htlleonding.instaff.features.templateRole.TemplateRole;
import at.htlleonding.instaff.features.templateRole.TemplateRoleRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.LinkedList;

@Path("{companyId}/shift-templates")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ShiftTemplateResource {
    @Inject
    ShiftTemplateRepository shiftTemplateRepository;
    @Inject
    ShiftTemplateMapper shiftTemplateMapper;
    @Inject
    TemplateRoleRepository templateRoleRepository;

    @GET
    public Response all(@PathParam("companyId") Long companyId) {
        var shiftTemplates = shiftTemplateRepository.findByCompany(companyId);
        return Response.ok(shiftTemplates.stream().map(shiftTemplateMapper::toResource).toList()).build();
    }

    @POST
    public Response create(ShiftTemplateCreateDTO dto) {
        shiftTemplateRepository.create(dto);
        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @Transactional
    public Response update(ShiftTemplateDTO dto) {
        ShiftTemplate shiftTemplate = shiftTemplateRepository.findById(dto.id());

        if (shiftTemplate == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        shiftTemplate.setShiftTemplateName(dto.shiftTemplateName());
        templateRoleRepository.unassign(shiftTemplate);
        shiftTemplate.setTemplateRoles(new LinkedList<TemplateRole>());
        templateRoleRepository.assign(dto.templateRoles(), shiftTemplate);
        shiftTemplateRepository.persist(shiftTemplate);

        return Response.status(Response.Status.CREATED).entity(shiftTemplate).build();
    }

    @DELETE
    @Path("delete/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        ShiftTemplate shiftTemplate = shiftTemplateRepository.findById(id);
        if (shiftTemplate == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        shiftTemplateRepository.delete(shiftTemplate);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

}
