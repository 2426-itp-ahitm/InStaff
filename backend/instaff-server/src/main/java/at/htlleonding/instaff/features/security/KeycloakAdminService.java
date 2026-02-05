package at.htlleonding.instaff.features.security;

import at.htlleonding.instaff.features.employee.Employee;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.Form;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.net.URI;
import java.util.List;

@ApplicationScoped
public class KeycloakAdminService {

    @ConfigProperty(name = "keycloak.url")
    String keycloakUrl;

    @ConfigProperty(name = "keycloak.realm")
    String realm;

    @ConfigProperty(name = "keycloak.admin.client-id")
    String clientId;

    @ConfigProperty(name = "keycloak.admin.client-secret")
    String clientSecret;

    public String createUser(Employee employee) {

        Client client = ClientBuilder.newClient();
        String accessToken = getAdminToken(client);

        Response createResponse = client
                .target(keycloakUrl + "/admin/realms/" + realm + "/users")
                .request()
                .header("Authorization", "Bearer " + accessToken)
                .post(Entity.json(new KeycloakUserRequest(employee)));

        String userId;

        if (createResponse.getStatus() == 201) {
            userId = extractIdFromLocation(createResponse.getLocation());
        } else if (createResponse.getStatus() == 409) {
            userId = findUserIdByEmail(client, accessToken, employee.getEmail());
        } else {
            client.close();
            throw new IllegalStateException(
                    "Keycloak user creation failed: " + createResponse.getStatus()
            );
        }

        // 1️⃣ Startpasswort setzen
        client
                .target(keycloakUrl + "/admin/realms/" + realm + "/users/" + userId + "/reset-password")
                .request()
                .header("Authorization", "Bearer " + accessToken)
                .put(Entity.json(new PasswordRequest("Start1234")));

        // 2️⃣ Required Actions setzen
        client
                .target(keycloakUrl + "/admin/realms/" + realm + "/users/" + userId)
                .request()
                .header("Authorization", "Bearer " + accessToken)
                .put(Entity.json(
                        java.util.Map.of(
                                "requiredActions",
                                List.of("VERIFY_EMAIL", "UPDATE_PASSWORD")
                        )
                ));

        client.close();
        return userId;
    }

    private String getAdminToken(Client client) {

        Form form = new Form();
        form.param("grant_type", "client_credentials");
        form.param("client_id", clientId);
        form.param("client_secret", clientSecret);

        Response response = client
                .target(keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token")
                .request()
                .post(Entity.form(form));

        if (response.getStatus() != 200) {
            throw new IllegalStateException("Failed to get admin token from Keycloak");
        }

        return response.readEntity(TokenResponse.class).access_token;
    }

    private String findUserIdByEmail(Client client, String accessToken, String email) {

        Response response = client
                .target(keycloakUrl + "/admin/realms/" + realm + "/users")
                .queryParam("email", email)
                .request()
                .header("Authorization", "Bearer " + accessToken)
                .get();

        if (response.getStatus() != 200) {
            throw new IllegalStateException("Failed to search user in Keycloak");
        }

        List<?> users = response.readEntity(List.class);

        if (users.isEmpty()) {
            throw new IllegalStateException(
                    "User exists but could not be found in Keycloak: " + email
            );
        }

        return ((java.util.Map<?, ?>) users.get(0)).get("id").toString();
    }

    private String extractIdFromLocation(URI location) {
        String path = location.getPath();
        return path.substring(path.lastIndexOf("/") + 1);
    }

    public static class KeycloakUserRequest {
        public String username;
        public String email;
        public String firstName;
        public String lastName;
        public boolean enabled = true;

        public KeycloakUserRequest(Employee e) {
            this.username = e.getEmail();
            this.email = e.getEmail();
            this.firstName = e.getFirstname();
            this.lastName = e.getLastname();
        }
    }

    public static class PasswordRequest {
        public String type = "password";
        public String value;
        public boolean temporary = false;

        public PasswordRequest(String value) {
            this.value = value;
        }
    }

    public static class TokenResponse {
        public String access_token;
    }
}
