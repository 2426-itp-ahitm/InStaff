package at.htlleonding.instaff.features.shiftTemplate;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("{companyId}/shift-templates")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ShiftTemplateResource {
    @Inject
    ShiftTemplateRepository shiftTemplateRepository;
    @Inject
    ShiftTemplateMapper shiftTemplateMapper;

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
