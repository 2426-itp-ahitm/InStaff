package at.instaff.features.security;

import java.io.IOException;
import java.net.URI;
import java.net.URLDecoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.eclipse.microprofile.config.ConfigProvider;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.websocket.HandshakeResponse;
import jakarta.websocket.server.HandshakeRequest;
import jakarta.websocket.server.ServerEndpointConfig;

public class CustomSocketConfigurator extends ServerEndpointConfig.Configurator {

    @Override
    public void modifyHandshake(ServerEndpointConfig config,
                                HandshakeRequest request,
                                HandshakeResponse response) {
        String token = extractToken(request);
        if (token == null || token.isBlank()) {
            System.err.println("WebSocket auth failed: missing token");
            throw new RuntimeException("Missing token");
        }

        try {
            RSAPublicKey publicKey = getPublicKey(fetchRealmPublicKey());

            Algorithm algorithm = Algorithm.RSA256(publicKey, null);
            JWTVerifier verifier = JWT.require(algorithm).build();
            DecodedJWT jwt = verifier.verify(token);

            String keycloakUserId = jwt.getSubject();
            List<String> roles = extractRoles(jwt);

            //Long companyId = extractCompanyId(keycloakUserId);

            //config.getUserProperties().put("companyId", companyId);
            config.getUserProperties().put("userId", keycloakUserId);
            config.getUserProperties().put("roles", roles);

        } catch (Exception e) {
            System.err.println("WebSocket auth failed: " + e.getMessage());
            throw new RuntimeException("Unauthorized");
        }
    }

    private String extractToken(HandshakeRequest request) {
        String authHeader = request.getHeaders()
                .getOrDefault("Authorization", List.of())
                .stream()
                .findFirst()
                .orElse(null);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        String query = request.getQueryString();
        if (query == null || query.isBlank()) {
            return null;
        }

        for (String part : query.split("&")) {
            int idx = part.indexOf('=');
            if (idx <= 0) {
                continue;
            }

            String key = URLDecoder.decode(part.substring(0, idx), StandardCharsets.UTF_8);
            if (!"access_token".equals(key)) {
                continue;
            }

            return URLDecoder.decode(part.substring(idx + 1), StandardCharsets.UTF_8);
        }

        return null;
    }

    private List<String> extractRoles(DecodedJWT jwt) {
        JsonNode realmAccess = new ObjectMapper()
                .valueToTree(jwt.getClaim("realm_access").asMap());
        JsonNode roles = realmAccess.path("roles");

        if (!roles.isArray()) {
            return List.of();
        }

        List<String> extractedRoles = new ArrayList<>();
        roles.forEach(role -> extractedRoles.add(role.asText()));
        return extractedRoles;
    }

    private String fetchRealmPublicKey() throws IOException, InterruptedException {
        String keycloakUrl = ConfigProvider.getConfig()
                .getOptionalValue("keycloak.url", String.class)
                .orElse("http://localhost:8081");
        String realm = ConfigProvider.getConfig()
                .getOptionalValue("keycloak.realm", String.class)
                .orElse("instaff");

        String normalizedBaseUrl = keycloakUrl.replaceAll("/$", "");
        URI realmUri = URI.create(normalizedBaseUrl + "/realms/" + realm);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder(realmUri).GET().build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new RuntimeException("Failed to fetch realm key: HTTP " + response.statusCode());
        }

        JsonNode jsonNode = new ObjectMapper().readTree(response.body());
        String publicKey = jsonNode.path("public_key").asText();

        if (publicKey == null || publicKey.isBlank()) {
            throw new RuntimeException("Realm public_key is missing");
        }

        return publicKey;
    }

    private RSAPublicKey getPublicKey(String base64PublicKey) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(base64PublicKey);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory factory = KeyFactory.getInstance("RSA");
        return (RSAPublicKey) factory.generatePublic(spec);
    }
}
