package at.htlleonding.instaff.features.role;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/roles")
@Produces(MediaType.APPLICATION_JSON)
public class RoleResource {
    @Inject
    RoleRepository roleRepository;
    @Inject
    RoleMapper roleMapper;

    @GET
    public List<RoleDTO> all() {
        var roles = roleRepository.listAll();
        return roles
                .stream()
                .map(roleMapper::toResource)
                .toList();
    }
}
