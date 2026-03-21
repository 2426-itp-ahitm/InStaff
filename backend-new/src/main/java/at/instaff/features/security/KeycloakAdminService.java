package at.instaff.features.security;

import at.instaff.features.employee.Employee;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.Form;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.ArrayList;
import java.util.HashMap;
import java.net.URI;
import java.util.List;
import java.util.Locale;
import java.util.Map;

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
            userId = findUserIdByEmail(client, accessToken, employee.email);
        } else {
            client.close();
            throw new IllegalStateException(
                    "Keycloak user creation failed: " + createResponse.getStatus()
            );
        }

        if(employee.isManager) {
            client
                    .target(keycloakUrl + "/admin/realms/" + realm + "/users/" + userId + "/reset-password")
                    .request()
                    .header("Authorization", "Bearer " + accessToken)
                    .put(Entity.json(new PasswordRequest("admin")));
        } else {
            // Startpasswort setzen
            client
                    .target(keycloakUrl + "/admin/realms/" + realm + "/users/" + userId + "/reset-password")
                    .request()
                    .header("Authorization", "Bearer " + accessToken)
                    .put(Entity.json(new PasswordRequest("Start1234")));

            // Required Actions setzen
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
        }



        // Manager-Gruppe setzen (Gruppe hat die Realmrolle "user-is-manager")
        setManagerGroupMembership(client, accessToken, userId, employee.isManager);

        client.close();
        return userId;
    }

    /* Not in use
    public void promoteEmployeeToManager(Employee employee) {
        try (Client client = ClientBuilder.newClient()) {
            String accessToken = getAdminToken(client);
            String userId = resolveOrCreateUserId(client, accessToken, employee);
            setManagerGroupMembership(client, accessToken, userId, true);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to promote employee to manager", e);
        }
    }
    */

    public void syncEmployee(Employee employee, boolean emailChanged) {
        try (Client client = ClientBuilder.newClient()) {
            String accessToken = getAdminToken(client);
            String userId = resolveOrCreateUserId(client, accessToken, employee);
            ensureEmailNotUsedByAnotherUser(client, accessToken, userId, employee.email);

            Response updateResponse = client
                    .target(keycloakUrl + "/admin/realms/" + realm + "/users/" + userId)
                    .request(MediaType.APPLICATION_JSON_TYPE)
                    .header("Authorization", "Bearer " + accessToken)
                    .put(Entity.json(buildUserUpdateRequest(employee, emailChanged)));

            if (updateResponse.getStatus() != 204) {
                int status = updateResponse.getStatus();
                String responseBody = updateResponse.hasEntity() ? updateResponse.readEntity(String.class) : "";
                updateResponse.close();
                throw new IllegalStateException("Failed to update user in Keycloak: " + status + " " + responseBody);
            }
            updateResponse.close();

            setManagerGroupMembership(client, accessToken, userId, employee.isManager);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to sync employee to Keycloak", e);
        }
    }

    private void ensureEmailNotUsedByAnotherUser(Client client, String accessToken, String currentUserId, String email) {
        Response response = client
                .target(keycloakUrl + "/admin/realms/" + realm + "/users")
                .queryParam("email", email)
                .request()
                .header("Authorization", "Bearer " + accessToken)
                .get();

        if (response.getStatus() != 200) {
            int status = response.getStatus();
            response.close();
            throw new IllegalStateException("Failed to check email in Keycloak: " + status);
        }

        List<?> users = response.readEntity(List.class);
        response.close();

        for (Object user : users) {
            Map<?, ?> keycloakUser = (Map<?, ?>) user;
            Object foundId = keycloakUser.get("id");
            if (foundId != null && !foundId.toString().equals(currentUserId)) {
                throw new IllegalStateException("Email already used in Keycloak: " + email);
            }
        }
    }

    private String resolveOrCreateUserId(Client client, String accessToken, Employee employee) {
        if (employee.keycloakUserId != null && !employee.keycloakUserId.isBlank()) {
            return employee.keycloakUserId;
        }

        try {
            String userId = findUserIdByEmail(client, accessToken, employee.email);
            employee.keycloakUserId = userId;
            return userId;
        } catch (IllegalStateException ignored) {
            String userId = createUser(employee);
            employee.keycloakUserId = userId;
            return userId;
        }
    }

    private Map<String, Object> buildUserUpdateRequest(Employee employee, boolean emailChanged) {
        Map<String, Object> request = new HashMap<>();
        request.put("email", employee.email);
        request.put("firstName", employee.firstName);
        request.put("lastName", employee.lastName);
        request.put("enabled", employee.isActive);

        if (emailChanged) {
            request.put("emailVerified", false);
            request.put("requiredActions", new ArrayList<>(List.of("VERIFY_EMAIL")));
        }

        return request;
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

    private void setManagerGroupMembership(Client client, String accessToken, String userId, boolean isManager) {

        String groupId = findOrCreateGroupIdByName(client, accessToken, "manager");

        if (isManager) {
            Response addResponse = client
                    .target(keycloakUrl + "/admin/realms/" + realm + "/users/" + userId + "/groups/" + groupId)
                    .request()
                    .header("Authorization", "Bearer " + accessToken)
                    .put(Entity.text(""));

            // 204 = success, 409 = already a member (treat as success)
            if (addResponse.getStatus() != 204 && addResponse.getStatus() != 409) {
                throw new IllegalStateException("Failed to add user to manager group: " + addResponse.getStatus());
            }
            addResponse.close();
            return;
        }

        Response removeResponse = client
                .target(keycloakUrl + "/admin/realms/" + realm + "/users/" + userId + "/groups/" + groupId)
                .request()
                .header("Authorization", "Bearer " + accessToken)
                .delete();

        // 204 = removed, 404 = not a member / not found (treat as ok)
        if (removeResponse.getStatus() != 204 && removeResponse.getStatus() != 404) {
            throw new IllegalStateException("Failed to remove user from manager group: " + removeResponse.getStatus());
        }
        removeResponse.close();
    }

    private String findGroupIdByName(Client client, String accessToken, String groupName) {

        Response response = client
                .target(keycloakUrl + "/admin/realms/" + realm + "/groups")
                .queryParam("search", groupName)
                .request()
                .header("Authorization", "Bearer " + accessToken)
                .get();

        if (response.getStatus() != 200) {
            throw new IllegalStateException("Failed to search group in Keycloak: " + response.getStatus());
        }

        List<?> groups = response.readEntity(List.class);
        response.close();

        for (Object g : groups) {
            java.util.Map<?, ?> group = (java.util.Map<?, ?>) g;
            Object name = group.get("name");
            if (name != null && groupName.equals(name.toString())) {
                Object id = group.get("id");
                if (id != null) {
                    return id.toString();
                }
            }
        }

        List<String> returnedNames = new java.util.ArrayList<>();
        for (Object g : groups) {
            java.util.Map<?, ?> group = (java.util.Map<?, ?>) g;
            Object n = group.get("name");
            if (n != null) {
                returnedNames.add(n.toString());
            }
        }

        throw new IllegalStateException("Group not found in Keycloak: " + groupName + " (search returned: " + returnedNames + ")");
    }

    private String findOrCreateGroupIdByName(Client client, String accessToken, String groupName) {

        // 1) Try find first
        try {
            return findGroupIdByName(client, accessToken, groupName);
        } catch (IllegalStateException ignored) {
            // fall through to create
        }

        // 2) Create group if missing
        Response createResponse = client
                .target(keycloakUrl + "/admin/realms/" + realm + "/groups")
                .request()
                .header("Authorization", "Bearer " + accessToken)
                .post(Entity.json(java.util.Map.of("name", groupName)));

        if (createResponse.getStatus() != 201) {
            int status = createResponse.getStatus();
            createResponse.close();
            throw new IllegalStateException("Failed to create group in Keycloak: " + groupName + " (" + status + ")");
        }

        URI location = createResponse.getLocation();
        createResponse.close();

        if (location == null) {
            throw new IllegalStateException("Group created but Location header missing: " + groupName);
        }

        return extractIdFromLocation(location);
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
            this.username = buildUsername(e);
            this.email = e.email;
            this.firstName = e.firstName;
            this.lastName = e.lastName;
        }

        private static String buildUsername(Employee employee) {
            String companyName = employee.company != null ? employee.company.companyName : "company";
            String normalizedCompanyName = companyName
                    .toLowerCase(Locale.ROOT)
                    .replaceAll("[^a-z0-9]+", "-")
                    .replaceAll("^-+|-+$", "");

            if (normalizedCompanyName.isBlank()) {
                normalizedCompanyName = "company";
            }

            return "employee-" + normalizedCompanyName + "-" + employee.id;
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
