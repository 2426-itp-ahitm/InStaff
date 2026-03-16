package at.instaff.features.security;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

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
