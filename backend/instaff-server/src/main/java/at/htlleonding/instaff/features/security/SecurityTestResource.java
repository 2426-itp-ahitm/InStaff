package at.htlleonding.instaff.features.security;

import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.SecurityContext;

@Path("/security")
public class SecurityTestResource {
    @Inject
    CustomSecurityContext ctx;

    @GET
    public String hello() {
        String username = ctx.username;
        return "Hello, " + username + "!";
    }
}
