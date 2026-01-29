package at.htlleonding.instaff.features.security;

import at.htlleonding.instaff.features.employee.Employee;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.logging.Log;
import jakarta.annotation.Priority;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ResourceInfo;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.*;

@Provider
public class JwtRequestFilter implements ContainerRequestFilter {
    @Inject
    CustomSecurityContext customSecurityContext;
    @Inject
    EntityManager em;

    String realmPublicKey = "";

    @Context
    private ResourceInfo resourceInfo;

    public static String getRealmPublicKey() throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://it210157.cloud.htl-leonding.ac.at/auth/realms/demo"))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(response.body());

        String publicKey = root.get("public_key").asText();

        return publicKey;
    }

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {

        // Skip authentication for @PermitAll
        if (isPermitAll()) {
            return;
        }

        try {
            realmPublicKey = getRealmPublicKey();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        var authHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            abortWithUnauthorized(requestContext);
            return;
        }

        var token = authHeader.substring("Bearer ".length());

        try {
            Algorithm algorithm = Algorithm.RSA256(getPublicKey(realmPublicKey), null);
            JWTVerifier verifier = JWT.require(algorithm).build();
            DecodedJWT jwt = verifier.verify(token);

            String keycloakUserId = jwt.getSubject(); // JWT "sub"
            String username = jwt.getClaim("preferred_username").asString();
            String fullName = jwt.getClaim("given_name").asString();

            Employee employee = em.createQuery("SELECT e FROM Employee e WHERE e.keycloakUserId = :kcId", Employee.class)
                    .setParameter("kcId", keycloakUserId).getResultStream().findFirst().orElse(null);
            if (employee == null) {
                // Activate this for the .http-files to work
                employee = em.createQuery("SELECT e FROM Employee e WHERE e.keycloakUserId = :kcId", Employee.class).setParameter("kcId", "11111111-1111-1111-1111-111111111111").getResultStream().findFirst().orElse(null);

                // Deactivate this for the .http-files to work
                //contextAbort(requestContext, Response.Status.FORBIDDEN, "User not in Database");

                return;
            }

            List<String> userRoles = extractRoles(jwt);

            // Check @RolesAllowed
            Set<String> requiredRoles = getRolesAllowed();
            if (!requiredRoles.isEmpty() && Collections.disjoint(userRoles, requiredRoles)) {
                contextAbort(requestContext, Response.Status.FORBIDDEN, "Missing requred role");
                return;
            }

            customSecurityContext.fullName = fullName;
            customSecurityContext.username = username;
            customSecurityContext.roles = userRoles;
            customSecurityContext.employeeId = employee.getId();
            customSecurityContext.keycloakUserId = keycloakUserId;

            requestContext.setProperty("employee", employee);

        } catch (JWTVerificationException | GeneralSecurityException e) {
            Log.error("Failed to verify Token: ", e);
            abortWithUnauthorized(requestContext);
        }
    }

    private boolean isPermitAll() {
        return resourceInfo.getResourceMethod().isAnnotationPresent(PermitAll.class)
                || resourceInfo.getResourceClass().isAnnotationPresent(PermitAll.class);
    }

    private Set<String> getRolesAllowed() {
        RolesAllowed rolesAnnotation = resourceInfo.getResourceMethod().getAnnotation(RolesAllowed.class);
        if (rolesAnnotation == null) {
            rolesAnnotation = resourceInfo.getResourceClass().getAnnotation(RolesAllowed.class);
        }
        return rolesAnnotation != null
                ? new HashSet<>(Arrays.asList(rolesAnnotation.value()))
                : Collections.emptySet();
    }

    private List<String> extractRoles(DecodedJWT jwt) {
        Map<String, Object> realmAccess = jwt.getClaim("realm_access").asMap();
        if (realmAccess != null && realmAccess.get("roles") instanceof List<?> rawRoles) {
            return rawRoles.stream().map(String::valueOf).toList();
        }
        return List.of();
    }

    private void abortWithUnauthorized(ContainerRequestContext context) {
        context.abortWith(Response.status(Response.Status.UNAUTHORIZED).entity("Access Denied").build());
    }

    private void contextAbort(
            ContainerRequestContext context,
            Response.Status status,
            String message
    ) {
        context.abortWith(
                Response.status(status)
                        .entity(message)
                        .build()
        );
    }
    private RSAPublicKey getPublicKey(String base64PublicKey) throws GeneralSecurityException {
        byte[] keyBytes = Base64.getDecoder().decode(base64PublicKey);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory factory = KeyFactory.getInstance("RSA");
        return (RSAPublicKey) factory.generatePublic(spec);
    }
}
