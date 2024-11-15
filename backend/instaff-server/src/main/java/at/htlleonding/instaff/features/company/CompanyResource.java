package at.htlleonding.instaff.features.company;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/companies")
@Produces(MediaType.APPLICATION_JSON)
public class CompanyResource {
    @Inject
    CompanyRepository companyRepository;
    @Inject
    CompanyMapper companyMapper;

    @GET
    public List<CompanyDTO> all() {
        var companies = companyRepository.listAll();
        return companies
                .stream()
                .map(companyMapper::toResource)
                .toList();
    }
}
