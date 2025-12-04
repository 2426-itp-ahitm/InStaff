package at.htlleonding.instaff.features.security;

import jakarta.ws.rs.core.SecurityContext;

import java.security.Principal;
import java.util.List;

public class CustomSecurityContext implements SecurityContext {

    private final String username;
    private final List<String> roles;
    private final String fullName;

    public CustomSecurityContext(String username, List<String> roles, String fullName) {
        this.username = username;
        this.roles = roles;
        this.fullName = fullName;
    }

    @Override
    public Principal getUserPrincipal() {
        return () -> username;
    }

    public String getFullName() {
        return fullName;
    }

    @Override
    public boolean isUserInRole(String role) {
        return roles.contains(role);
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
