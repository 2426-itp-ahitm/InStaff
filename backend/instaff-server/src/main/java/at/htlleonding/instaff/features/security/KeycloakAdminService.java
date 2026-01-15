package at.htlleonding.instaff.features.security;

import at.htlleonding.instaff.features.employee.Employee;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.Form;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

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

        // 1) get admin access token
        String accessToken = getAdminToken(client);

        // 2) create user
        Response createResponse = client
                .target(keycloakUrl + "/admin/realms/" + realm + "/users")
                .request()
                .header("Authorization", "Bearer " + accessToken)
                .post(Entity.json(new KeycloakUserRequest(employee)));

        if (createResponse.getStatus() != 201) {
            throw new IllegalStateException("Keycloak user creation failed: " + createResponse.getStatus());
        }

        // 3) extract userId from Location header
        String location = createResponse.getHeaderString("Location");
        String keycloakUserId = location.substring(location.lastIndexOf("/") + 1);

        // 4) set initial password
        client
                .target(keycloakUrl + "/admin/realms/" + realm + "/users/" + keycloakUserId + "/reset-password")
                .request()
                .header("Authorization", "Bearer " + accessToken)
                .put(Entity.json(new PasswordRequest("Start1234")));

        return keycloakUserId;
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
        public boolean temporary = true;

        public PasswordRequest(String value) {
            this.value = value;
        }
    }

    public static class TokenResponse {
        public String access_token;
    }
}
