package at.htlleonding.instaff.features.company;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

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

    @POST
    @Transactional
    public Response createCompany(CompanyCreateDTO companyCreateDTO) {
        Company company = companyMapper.fromCreateDTO(companyCreateDTO);

        companyRepository.persist(company);

        return Response.status(Response.Status.CREATED)
                .entity(companyMapper.toResource(company))
                .build();
    }
}
