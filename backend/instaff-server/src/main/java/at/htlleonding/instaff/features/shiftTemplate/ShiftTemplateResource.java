package at.htlleonding.instaff.features.shiftTemplate;

import jakarta.inject.Inject;
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
}
