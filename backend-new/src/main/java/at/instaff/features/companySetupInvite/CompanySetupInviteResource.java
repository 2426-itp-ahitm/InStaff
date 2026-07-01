package at.instaff.features.companySetupInvite;

import at.instaff.features.company.CompanySetupLoginDTO;
import at.instaff.features.company.Company;
import at.instaff.features.company.CompanyStatus;
import at.instaff.features.company.legalConfirmation.CompanyLegalConfirmation;
import at.instaff.features.company.openingHour.CompanyOpeningHour;
import at.instaff.features.mailService.MailService;
import at.instaff.features.employee.Employee;
import at.instaff.features.role.Role;
import at.instaff.features.security.KeycloakAdminService;
import at.instaff.features.shiftTemplate.ShiftTemplate;
import at.instaff.features.templateRole.TemplateRole;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.time.LocalDateTime;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Path("/")
public class CompanySetupInviteResource {
    private static final int MAX_FAILED_SETUP_LOGIN_ATTEMPTS = 3;
    private static final int SETUP_LOGIN_LOCK_MINUTES = 30;
    private static final int SETUP_SESSION_MINUTES = 30;

    private final MailService mailService;
    private final KeycloakAdminService keycloakAdminService;
    private final CompanySetupInviteSocket companySetupInviteSocket;

    @Inject
    public CompanySetupInviteResource(
            MailService mailService,
            KeycloakAdminService keycloakAdminService,
            CompanySetupInviteSocket companySetupInviteSocket
    ) {
        this.mailService = mailService;
        this.keycloakAdminService = keycloakAdminService;
        this.companySetupInviteSocket = companySetupInviteSocket;
    }

    @GET
    @Path("/admin/company-setup/invites")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed("user-is-internal-admin")
    public Response getInvites() {
        return Response.ok(CompanySetupInvite.findAll().stream().map(setup -> CompanySetupDTO.toResource((CompanySetupInvite) setup)).toList()).build();
    }

    @POST
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/admin/company-setup/invites")
    @RolesAllowed("user-is-internal-admin")
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
        broadcastInviteList();

        return Response.status(Response.Status.CREATED).entity(CompanySetupInviteResponseDTO.toResource(setupInvite, setupPassword)).build();
    }

    @POST
    @Transactional
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/admin/company-setup/invites/{id}/resend")
    @RolesAllowed("user-is-internal-admin")
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
        broadcastInviteList();

        return Response.ok(CompanySetupInviteResponseDTO.toResource(setupInvite, setupPassword)).build();
    }

    @PUT
    @Transactional
    @Path("/admin/company-setup/invites/{id}/disable")
    @RolesAllowed("user-is-internal-admin")
    public Response disableInvite(@Context SecurityContext sc, @PathParam("id") Long id) {
        CompanySetupInvite setupInvite = CompanySetupInvite.findById(id);

        if (setupInvite == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        setupInvite.status = CompanySetupInviteStatus.DISABLED;
        setupInvite.disabledAt = LocalDateTime.now();
        setupInvite.disabledBy = sc.getUserPrincipal().getName();

        if (setupInvite.company != null) {
            setupInvite.company.status = CompanyStatus.DISABLED;
        }

        broadcastInviteList();

        return Response.status(Response.Status.ACCEPTED).build();
    }

    @PUT
    @Transactional
    @Path("/admin/company-setup/invites/{id}/delete")
    @RolesAllowed("user-is-internal-admin")
    public Response deleteInvite(@Context SecurityContext sc, @PathParam("id") Long id) {
        CompanySetupInvite setupInvite = CompanySetupInvite.findById(id);

        if (setupInvite == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        setupInvite.status = CompanySetupInviteStatus.DELETED;
        setupInvite.disabledAt = LocalDateTime.now();
        setupInvite.disabledBy = sc.getUserPrincipal().getName();

        if (setupInvite.company != null) {
            setupInvite.company.status = CompanyStatus.DISABLED;
        }

        broadcastInviteList();

        return Response.status(Response.Status.ACCEPTED).build();
    }

    @GET
    @Path("/company-setup/{token}")
    @PermitAll
    @Transactional
    @Produces(MediaType.APPLICATION_JSON)
    public Response validateToken(@PathParam("token") String token) {
        CompanySetupInvite setupInvite = CompanySetupInvite.find("setupToken = ?1", token).firstResult();

        if (setupInvite == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (setupInvite.status == CompanySetupInviteStatus.LOCKED
                && setupInvite.lockedUntil != null
                && !setupInvite.lockedUntil.isAfter(LocalDateTime.now())) {
            setupInvite.failedAttempts = 0;
            setupInvite.lockedUntil = null;
            setupInvite.status = setupInvite.company == null
                    ? CompanySetupInviteStatus.OPEN
                    : CompanySetupInviteStatus.IN_PROGRESS;
            broadcastInviteList();
        }

        if (setupInvite.status != CompanySetupInviteStatus.OPEN
                && setupInvite.status != CompanySetupInviteStatus.IN_PROGRESS) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("Setup invite cannot be used in status " + setupInvite.status)
                    .build();
        }

        return Response.ok(new CompanySetupTokenValidationDTO(true, setupInvite.preliminaryCompanyName)).build();
    }

    @POST
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/company-setup/{token}/login")
    @PermitAll
    public Response login(@PathParam("token") String token, CompanySetupLoginDTO loginDTO) {
        CompanySetupInvite setupInvite = CompanySetupInvite.find("setupToken = ?1", token).firstResult();

        if (setupInvite == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (setupInvite.status == CompanySetupInviteStatus.COMPLETED
                || setupInvite.status == CompanySetupInviteStatus.DISABLED
                || setupInvite.status == CompanySetupInviteStatus.DELETED) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("Setup invite cannot be used in status " + setupInvite.status)
                    .build();
        }

        if (setupInvite.lockedUntil != null && setupInvite.lockedUntil.isAfter(LocalDateTime.now())) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Setup invite is locked until " + setupInvite.lockedUntil)
                    .build();
        }

        boolean inviteStatusResetAfterExpiredLock = false;

        if (setupInvite.lockedUntil != null) {
            setupInvite.failedAttempts = 0;
            setupInvite.lockedUntil = null;
            setupInvite.status = setupInvite.company == null
                    ? CompanySetupInviteStatus.OPEN
                    : CompanySetupInviteStatus.IN_PROGRESS;
            inviteStatusResetAfterExpiredLock = true;
        }

        if (!setupInvite.passwordMatches(loginDTO.password(), setupInvite.setupPasswordHash)) {
            setupInvite.failedAttempts++;

            if (setupInvite.failedAttempts >= MAX_FAILED_SETUP_LOGIN_ATTEMPTS) {
                setupInvite.lockedUntil = LocalDateTime.now().plusMinutes(SETUP_LOGIN_LOCK_MINUTES);
                setupInvite.status = CompanySetupInviteStatus.LOCKED;
                broadcastInviteList();

                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("Too many failed setup login attempts. Try again in 30 minutes.")
                        .build();
            }

            if (inviteStatusResetAfterExpiredLock) {
                broadcastInviteList();
            }

            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        setupInvite.failedAttempts = 0;
        setupInvite.lockedUntil = null;

        setupInvite.status = CompanySetupInviteStatus.IN_PROGRESS;
        broadcastInviteList();

        CompanySetupSession existingSession = CompanySetupSession
                .find("invite = ?1 and active = true", setupInvite)
                .firstResult();

        if (existingSession != null && existingSession.expiresAt != null && existingSession.expiresAt.isAfter(LocalDateTime.now())) {
            String setupSessionToken = setupInvite.generateUniqueToken();
            existingSession.sessionTokenHash = setupInvite.hashPassword(setupSessionToken);
            existingSession.expiresAt = LocalDateTime.now().plusMinutes(SETUP_SESSION_MINUTES);
            existingSession.lastUsedAt = LocalDateTime.now();

            return Response.ok(CompanySetupSessionDTO.from(existingSession, setupSessionToken)).build();
        }

        if (existingSession != null) {
            existingSession.active = false;
        }

        String setupSessionToken = setupInvite.generateUniqueToken();
        CompanySetupSession setupSession = new CompanySetupSession();
        setupSession.invite = setupInvite;
        setupSession.sessionTokenHash = setupInvite.hashPassword(setupSessionToken);
        setupSession.createdAt = LocalDateTime.now();
        setupSession.expiresAt = setupSession.createdAt.plusMinutes(SETUP_SESSION_MINUTES);
        setupSession.lastUsedAt = setupSession.createdAt;
        setupSession.active = true;
        setupSession.persist();

        return Response.ok(CompanySetupSessionDTO.from(setupSession, setupSessionToken)).build();
    }

    @POST
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/company-setup/company")
    @PermitAll
    public Response createNewCompany(
            @HeaderParam("X-Setup-Session") String setupSessionToken,
            CompanySetupCompleteDTO setupDTO
    ) {
        CompanySetupSession setupSession = getValidSetupSession(setupSessionToken);
        CompanySetupInvite invite = setupSession.invite;

        if (invite.company != null) {
            throw new WebApplicationException("Company has already been created for this setup invite", Response.Status.CONFLICT);
        }

        validateCompleteSetupDTO(setupDTO);

        Company company = createCompany(setupDTO.company());
        invite.company = company;

        Map<String, Role> rolesByName = createRoles(company, setupDTO.roles());
        Employee owner = createEmployee(company, setupDTO.owner(), rolesByName, true);
        company.ownerEmployee = owner;

        createOpeningHours(company, setupDTO.openingHours());
        createLegalConfirmation(company, setupDTO.legalConfirmation(), owner.email);
        createShiftTemplates(company, setupDTO.shiftTemplates(), rolesByName);
        List<Employee> employees = createEmployees(company, setupDTO.employees(), rolesByName);
        createKeycloakUsers(owner, employees);

        setupSession.active = false;
        invite.status = CompanySetupInviteStatus.COMPLETED;
        invite.completedAt = LocalDateTime.now();
        company.status = CompanyStatus.ACTIVE;
        broadcastInviteList();

        return Response.status(Response.Status.CREATED).entity(CompanySetupDTO.toResource(invite)).build();
    }

    private void broadcastInviteList() {
        companySetupInviteSocket.broadcastInvites();
    }

    private CompanySetupSession getValidSetupSession(String setupSessionToken) {
        if (setupSessionToken == null || setupSessionToken.isBlank()) {
            throw new WebApplicationException("Missing X-Setup-Session header", Response.Status.UNAUTHORIZED);
        }

        List<CompanySetupSession> activeSessions = CompanySetupSession.list("active", true);

        CompanySetupSession setupSession = activeSessions.stream()
                .filter(session -> session.invite.passwordMatches(setupSessionToken, session.sessionTokenHash))
                .findFirst()
                .orElseThrow(() -> new WebApplicationException("Invalid setup session", Response.Status.UNAUTHORIZED));

        if (setupSession.expiresAt == null || !setupSession.expiresAt.isAfter(LocalDateTime.now())) {
            setupSession.active = false;
            throw new WebApplicationException("Setup session expired", Response.Status.UNAUTHORIZED);
        }

        CompanySetupInvite invite = setupSession.invite;

        if (invite == null
                || invite.status != CompanySetupInviteStatus.IN_PROGRESS
                || invite.company != null) {
            throw new WebApplicationException("Invalid setup state", Response.Status.CONFLICT);
        }

        setupSession.lastUsedAt = LocalDateTime.now();

        return setupSession;
    }

    private void validateCompleteSetupDTO(CompanySetupCompleteDTO setupDTO) {
        if (setupDTO == null || setupDTO.company() == null || setupDTO.owner() == null
                || setupDTO.openingHours() == null || setupDTO.legalConfirmation() == null) {
            throw new WebApplicationException("Company, owner, opening hours and legal confirmation are required", Response.Status.BAD_REQUEST);
        }

        validateCompanyDTO(setupDTO.company());
        validateOwnerDTO(setupDTO.owner());
        validateRoles(setupDTO.roles());
        validateShiftTemplates(setupDTO.shiftTemplates());
        validateEmployees(setupDTO.employees());

        if (setupDTO.openingHours().openingHours() == null || setupDTO.openingHours().openingHours().size() != DayOfWeek.values().length) {
            throw new WebApplicationException("Exactly one opening hour entry per weekday is required", Response.Status.BAD_REQUEST);
        }

        boolean hasAllWeekdays = setupDTO.openingHours().openingHours().stream()
                .map(openingHour -> openingHour.weekday())
                .filter(Objects::nonNull)
                .distinct()
                .count() == DayOfWeek.values().length;

        if (!hasAllWeekdays) {
            throw new WebApplicationException("Opening hours must contain every weekday exactly once", Response.Status.BAD_REQUEST);
        }

        boolean invalidOpeningHour = setupDTO.openingHours().openingHours().stream()
                .anyMatch(openingHour -> !openingHour.isClosed() && (openingHour.startTime() == null || openingHour.endTime() == null));

        if (invalidOpeningHour) {
            throw new WebApplicationException("Open weekdays require start and end time", Response.Status.BAD_REQUEST);
        }

        if (!setupDTO.legalConfirmation().dataIsCorrect()
                || !setupDTO.legalConfirmation().authorizedToRegisterCompany()
                || !setupDTO.legalConfirmation().acceptedPrivacyPolicy()
                || !setupDTO.legalConfirmation().acceptedTerms()) {
            throw new WebApplicationException("All legal confirmations are required", Response.Status.BAD_REQUEST);
        }
    }

    private void validateCompanyDTO(CompanySetupCompanyDTO companyDTO) {
        if (isBlank(companyDTO.companyName())
                || isBlank(companyDTO.uidNumber())
                || isBlank(companyDTO.publicEmail())
                || isBlank(companyDTO.publicTelephone())
                || isBlank(companyDTO.address())
                || isBlank(companyDTO.locationName())
                || isBlank(companyDTO.contactPersonName())
                || isBlank(companyDTO.contactPersonEmail())
                || isBlank(companyDTO.contactPersonTelephone())) {
            throw new WebApplicationException("All company fields are required", Response.Status.BAD_REQUEST);
        }
    }

    private void validateOwnerDTO(CompanySetupEmployeeDTO ownerDTO) {
        if (isBlank(ownerDTO.firstname())
                || isBlank(ownerDTO.lastname())
                || isBlank(ownerDTO.email())
                || isBlank(ownerDTO.telephone())
                || ownerDTO.birthDate() == null
                || isBlank(ownerDTO.address())) {
            throw new WebApplicationException("All owner fields are required", Response.Status.BAD_REQUEST);
        }
    }

    private void validateRoles(List<CompanySetupRoleDTO> roleDTOs) {
        if (roleDTOs == null) {
            return;
        }

        boolean hasInvalidRole = roleDTOs.stream().anyMatch(roleDTO -> roleDTO == null || isBlank(roleDTO.roleName()));
        if (hasInvalidRole) {
            throw new WebApplicationException("Setup roles require a role name", Response.Status.BAD_REQUEST);
        }

        long distinctRoleNames = roleDTOs.stream()
                .map(CompanySetupRoleDTO::roleName)
                .distinct()
                .count();

        if (distinctRoleNames != roleDTOs.size()) {
            throw new WebApplicationException("Setup role names must be unique", Response.Status.BAD_REQUEST);
        }
    }

    private void validateShiftTemplates(List<CompanySetupShiftTemplateDTO> shiftTemplateDTOs) {
        if (shiftTemplateDTOs == null) {
            return;
        }

        for (CompanySetupShiftTemplateDTO shiftTemplateDTO : shiftTemplateDTOs) {
            if (shiftTemplateDTO == null || isBlank(shiftTemplateDTO.shiftTemplateName())) {
                throw new WebApplicationException("Shift templates require a name", Response.Status.BAD_REQUEST);
            }

            if (shiftTemplateDTO.templateRoles() == null) {
                continue;
            }

            for (CompanySetupTemplateRoleDTO templateRoleDTO : shiftTemplateDTO.templateRoles()) {
                if (templateRoleDTO == null || isBlank(templateRoleDTO.roleName()) || templateRoleDTO.count() <= 0) {
                    throw new WebApplicationException("Shift template roles require a role name and positive count", Response.Status.BAD_REQUEST);
                }
            }
        }
    }

    private void validateEmployees(List<CompanySetupEmployeeDTO> employeeDTOs) {
        if (employeeDTOs == null) {
            return;
        }

        for (CompanySetupEmployeeDTO employeeDTO : employeeDTOs) {
            if (employeeDTO == null
                    || isBlank(employeeDTO.firstname())
                    || isBlank(employeeDTO.lastname())
                    || isBlank(employeeDTO.email())
                    || isBlank(employeeDTO.telephone())
                    || employeeDTO.birthDate() == null
                    || isBlank(employeeDTO.address())) {
                throw new WebApplicationException("All employee fields are required", Response.Status.BAD_REQUEST);
            }
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private Company createCompany(CompanySetupCompanyDTO dto) {
        Company company = new Company(dto.companyName());
        company.uidNumber = dto.uidNumber();
        company.publicEmail = dto.publicEmail();
        company.publicTelephone = dto.publicTelephone();
        company.address = dto.address();
        company.locationName = dto.locationName();
        company.contactPersonName = dto.contactPersonName();
        company.contactPersonEmail = dto.contactPersonEmail();
        company.contactPersonTelephone = dto.contactPersonTelephone();
        company.status = CompanyStatus.SETUP;
        company.persist();

        return company;
    }

    private Map<String, Role> createRoles(Company company, List<CompanySetupRoleDTO> roleDTOs) {
        Map<String, Role> rolesByName = new HashMap<>();

        if (roleDTOs == null) {
            return rolesByName;
        }

        for (CompanySetupRoleDTO roleDTO : roleDTOs) {
            Role role = new Role(roleDTO.roleName(), roleDTO.description(), company);
            role.persist();
            rolesByName.put(role.roleName, role);
        }

        return rolesByName;
    }

    private Employee createEmployee(Company company, CompanySetupEmployeeDTO dto, Map<String, Role> rolesByName, boolean owner) {
        List<Role> roles = resolveRoles(dto.roleNames(), rolesByName);
        Employee employee = new Employee(
                dto.firstname(),
                dto.lastname(),
                dto.email(),
                dto.telephone(),
                dto.birthDate(),
                dto.hourlyWage(),
                dto.address(),
                owner || Boolean.TRUE.equals(dto.isManager()),
                company,
                roles,
                owner || dto.isActive() == null || dto.isActive(),
                owner || Boolean.TRUE.equals(dto.isSelfManaged())
        );
        employee.persist();

        return employee;
    }

    private List<Role> resolveRoles(List<String> roleNames, Map<String, Role> rolesByName) {
        List<Role> roles = new ArrayList<>();

        if (roleNames == null) {
            return roles;
        }

        for (String roleName : roleNames) {
            Role role = rolesByName.get(roleName);
            if (role == null) {
                throw new WebApplicationException("Unknown setup role: " + roleName, Response.Status.BAD_REQUEST);
            }
            roles.add(role);
        }

        return roles;
    }

    private void createOpeningHours(Company company, at.instaff.features.company.openingHour.OpeningHoursUpdateDTO openingHoursDTO) {
        for (var openingHourDTO : openingHoursDTO.openingHours()) {
            CompanyOpeningHour openingHour = new CompanyOpeningHour();
            openingHour.company = company;
            openingHour.weekday = openingHourDTO.weekday();
            openingHour.isClosed = openingHourDTO.isClosed();
            openingHour.startTime = openingHourDTO.isClosed() ? null : openingHourDTO.startTime();
            openingHour.endTime = openingHourDTO.isClosed() ? null : openingHourDTO.endTime();
            openingHour.persist();
        }
    }

    private void createLegalConfirmation(Company company, at.instaff.features.company.legalConfirmation.LegalConfirmationDTO legalDTO, String ownerEmail) {
        CompanyLegalConfirmation legalConfirmation = new CompanyLegalConfirmation();
        legalConfirmation.company = company;
        legalConfirmation.dataIsCorrect = legalDTO.dataIsCorrect();
        legalConfirmation.authorizedToRegisterCompany = legalDTO.authorizedToRegisterCompany();
        legalConfirmation.acceptedPrivacyPolicy = legalDTO.acceptedPrivacyPolicy();
        legalConfirmation.acceptedTerms = legalDTO.acceptedTerms();
        legalConfirmation.confirmedByEmail = ownerEmail;
        legalConfirmation.confirmedAt = LocalDateTime.now();
        legalConfirmation.persist();
    }

    private void createShiftTemplates(Company company, List<CompanySetupShiftTemplateDTO> shiftTemplateDTOs, Map<String, Role> rolesByName) {
        if (shiftTemplateDTOs == null) {
            return;
        }

        for (CompanySetupShiftTemplateDTO shiftTemplateDTO : shiftTemplateDTOs) {
            ShiftTemplate shiftTemplate = new ShiftTemplate(shiftTemplateDTO.shiftTemplateName(), company);
            shiftTemplate.persist();

            if (shiftTemplateDTO.templateRoles() == null) {
                continue;
            }

            for (CompanySetupTemplateRoleDTO templateRoleDTO : shiftTemplateDTO.templateRoles()) {
                Role role = rolesByName.get(templateRoleDTO.roleName());
                if (role == null) {
                    throw new WebApplicationException("Unknown setup role for shift template: " + templateRoleDTO.roleName(), Response.Status.BAD_REQUEST);
                }

                TemplateRole templateRole = new TemplateRole(role, shiftTemplate, templateRoleDTO.count());
                templateRole.persist();
            }
        }
    }

    private List<Employee> createEmployees(Company company, List<CompanySetupEmployeeDTO> employeeDTOs, Map<String, Role> rolesByName) {
        List<Employee> employees = new ArrayList<>();

        if (employeeDTOs == null) {
            return employees;
        }

        for (CompanySetupEmployeeDTO employeeDTO : employeeDTOs) {
            employees.add(createEmployee(company, employeeDTO, rolesByName, false));
        }

        return employees;
    }

    private void createKeycloakUsers(Employee owner, List<Employee> employees) {
        owner.keycloakUserId = keycloakAdminService.createUser(owner);

        for (Employee employee : employees) {
            employee.keycloakUserId = keycloakAdminService.createUser(employee);
        }
    }
}
