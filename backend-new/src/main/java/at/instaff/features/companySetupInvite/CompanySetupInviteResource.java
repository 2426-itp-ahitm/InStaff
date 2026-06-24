package at.instaff.features.companySetupInvite;

import at.instaff.features.mailService.MailService;
import jakarta.annotation.security.RolesAllowed;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.time.LocalDateTime;

@Path("/admin/company-setup")
@RolesAllowed("user-is-internal-admin")
public class CompanySetupInviteResource {
    private final MailService mailService;

    @Inject
    public CompanySetupInviteResource(MailService mailService) {
        this.mailService = mailService;
    }

    @GET
    @Path("invites")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getInvites() {
        return Response.ok(CompanySetupInvite.findAll().stream().map(setup -> CompanySetupDTO.toResource((CompanySetupInvite) setup)).toList()).build();
    }

    @POST
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("invites")
    public Response createInvite(@Context SecurityContext sc, CompanySetupInviteCreateDTO invite) {
        CompanySetupInvite setupInvite = new CompanySetupInvite();
        setupInvite.recipientEmail = invite.recipientEmail();
        setupInvite.preliminaryCompanyName = invite.preliminaryCompanyName();
        setupInvite.createdAt = LocalDateTime.now();
        setupInvite.createdBy = sc.getUserPrincipal().getName();
        setupInvite.setupToken = setupInvite.generateUniqueToken();
        String setupPassword = setupInvite.generateSetupPassword();
        setupInvite.setupPasswordHash = setupInvite.hashPassword(setupPassword);

        setupInvite.persist();

        String setupLink = "http://localhost:4200/newCompany/" + setupInvite.setupToken;

        mailService.sendCompanySetupInvite(setupInvite.recipientEmail, setupLink, setupPassword);

        return Response.status(Response.Status.CREATED).entity(CompanySetupInviteResponseDTO.toResource(setupInvite, setupPassword)).build();
    }

    @POST
    @Transactional
    @Produces(MediaType.APPLICATION_JSON)
    @Path("invites/{id}/resend")
    public Response resendInvite(@PathParam("id") Long id) {
        CompanySetupInvite setupInvite = CompanySetupInvite.findById(id);

        if (setupInvite == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (setupInvite.status == CompanySetupInviteStatus.COMPLETED
                || setupInvite.status == CompanySetupInviteStatus.DISABLED
                || setupInvite.status == CompanySetupInviteStatus.DELETED) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("Setup invite cannot be resent in status " + setupInvite.status)
                    .build();
        }

        String setupPassword = setupInvite.generateSetupPassword();
        setupInvite.setupPasswordHash = setupInvite.hashPassword(setupPassword);
        setupInvite.failedAttempts = 0;
        setupInvite.lockedUntil = null;

        if (setupInvite.status == CompanySetupInviteStatus.LOCKED) {
            setupInvite.status = setupInvite.company == null
                    ? CompanySetupInviteStatus.OPEN
                    : CompanySetupInviteStatus.IN_PROGRESS;
        }

        String setupLink = "http://localhost:4200/newCompany/" + setupInvite.setupToken;

        mailService.sendCompanySetupInvite(setupInvite.recipientEmail, setupLink, setupPassword);

        return Response.ok(CompanySetupInviteResponseDTO.toResource(setupInvite, setupPassword)).build();
    }

    @PUT
    @Path("invites/{id}/disable")
    public Response disableInvite(@PathParam("id") Long id) {
        CompanySetupInvite setupInvite = CompanySetupInvite.findById(id);

        if (setupInvite == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        setupInvite.status = CompanySetupInviteStatus.DISABLED;

        return Response.status(Response.Status.ACCEPTED).build();
    }

    @PUT
    @Path("invites/{id}/delete")
    public Response deleteInvite(@PathParam("id") Long id) {
        CompanySetupInvite setupInvite = CompanySetupInvite.findById(id);

        if (setupInvite == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        setupInvite.status = CompanySetupInviteStatus.DELETED;

        return Response.status(Response.Status.ACCEPTED).build();
    }
}
