package at.instaff.features.security;

import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.core.SecurityContext;

import java.security.Principal;
import java.util.List;

@RequestScoped
public class CustomSecurityContext implements SecurityContext {

    String username;
    List<String> roles;
    String fullName;
    Long employeeId;
    String keycloakUserId;
    long companyId;
    Principal principal;

    public CustomSecurityContext() {
    }

    public void setPrincipal(Principal principal) {
        this.principal = principal;
    }

    @Override
    public Principal getUserPrincipal() {
        return principal;
    }

    public String getFullName() {
        return fullName;
    }

    public long getCompanyId() {
        return companyId;
    }

    @Override
    public boolean isUserInRole(String role) {
        return roles != null && roles.contains(role);
    }

    @Override
    public boolean isSecure() {
        return false;
    }

    @Override
    public String getAuthenticationScheme() {
        return "Bearer";
    }
}