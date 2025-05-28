package at.htlleonding.instaff.features.manager;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("{companyId}/managers")
@Produces(MediaType.APPLICATION_JSON)
public class ManagerResource {
    @Inject
    ManagerRepository managerRepository;
    @Inject
    ManagerMapper managerMapper;

    @GET
    public List<ManagerDTO> all(@PathParam("companyId") Long companyId) {
        var managers = managerRepository.findByCompany(companyId);
        return managers
                .stream()
                .map(managerMapper::toResource)
                .toList();
    }
}
