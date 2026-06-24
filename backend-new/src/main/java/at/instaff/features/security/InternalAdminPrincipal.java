package at.instaff.features.security;

import javax.security.auth.Subject;
import java.security.Principal;

public class InternalAdminPrincipal implements Principal {
    private final String name;
    private final String keycloakUserId;

    public InternalAdminPrincipal(String name, String keycloakUserId) {
        this.name = name;
        this.keycloakUserId = keycloakUserId;
    }
    @Override
    public String getName() {
        return name;
    }

    public String getKeycloakUserId() {
        return keycloakUserId;
    }
}
