package at.instaff.features.company;

import at.instaff.features.security.CustomPrincipal;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.ArrayList;
import java.util.List;

@Path("companies")
public class CompanyResource {

    @GET
    public Response getCompany(@Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Company company = Company.findById(principal.getCompanyId());
        return Response.ok(CompanyDTO.toResource(company)).build();
    }

    @POST
    @Transactional
    public Response createCompany(CompanyCreateDTO dto) {
        Company company = new Company(dto.companyName());
        company.persist();

        return Response.ok(CompanyDTO.toResource(company)).build();
    }


    @GET
    @Path("all")
    @RolesAllowed("user-is-internal-admin")
    public Response getCompanies() {
        return Response.ok(
                Company.findAll()
                        .stream()
                        .map(company -> CompanyDTO.toResource((Company) company))
                        .toList()
        ).build();
    }
}
