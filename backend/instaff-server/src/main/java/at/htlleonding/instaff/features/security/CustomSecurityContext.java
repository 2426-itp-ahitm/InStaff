package at.htlleonding.instaff.features.security;

import jakarta.enterprise.context.RequestScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.ws.rs.core.SecurityContext;

import java.security.Principal;
import java.util.List;

@RequestScoped
public class CustomSecurityContext implements SecurityContext {
    @Produces
    SecurityContext securityContext;

    String username;
    List<String> roles;
    String fullName;

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
