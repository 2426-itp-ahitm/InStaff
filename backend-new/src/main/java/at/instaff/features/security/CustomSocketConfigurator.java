package at.instaff.features.security;

import at.instaff.features.employee.Employee;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.logging.Log;
import jakarta.websocket.server.HandshakeRequest;
import jakarta.websocket.HandshakeResponse;
import jakarta.websocket.server.ServerEndpointConfig;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;

public class CustomSocketConfigurator extends ServerEndpointConfig.Configurator {

    @Override
    public void modifyHandshake(ServerEndpointConfig config,
                                HandshakeRequest request,
                                HandshakeResponse response) {

        String authHeader = request.getHeaders()
                .getOrDefault("Authorization", List.of())
                .stream()
                .findFirst()
                .orElse(null);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing token");
        }

        String token = authHeader.substring(7);

        try {
            RSAPublicKey publicKey = getPublicKey(fetchRealmPublicKey());

            Algorithm algorithm = Algorithm.RSA256(publicKey, null);
            JWTVerifier verifier = JWT.require(algorithm).build();
            DecodedJWT jwt = verifier.verify(token);

            String keycloakUserId = jwt.getSubject();

            //Long companyId = extractCompanyId(keycloakUserId);

            //config.getUserProperties().put("companyId", companyId);
            config.getUserProperties().put("userId", keycloakUserId);

        } catch (Exception e) {
            throw new RuntimeException("Unauthorized");
        }
    }

    private Long extractCompanyId(String keycloakUserId) {
        //Employee employee = Employee.find("keycloakUserId=?1", keycloakUserId).singleResult();
        return Employee.getEntityManager().createQuery("select company.id from Employee where keycloakUserId = :id", Long.class)
                .setParameter("id", keycloakUserId).getSingleResult();
    }

    /*Long companyId = em.createQuery(
    "SELECT e.company.id FROM Employee e WHERE e.keycloakUserId = :id", Long.class)
    .setParameter("id", keycloakUserId)
    .getSingleResult();*/

    private String fetchRealmPublicKey() throws URISyntaxException, IOException, InterruptedException {

        return "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApC/o0bkDKz5F5Tcx3bsrz0DqDhFK+k2+Jz89X49ALg5STEHlKum4tsj7bKY7nvT0mdudDtYyGnrX8gWXLpycqmTRS7omI3sT+KwmMWagUMxHS9vqoAksmf6xJhZvNDp0Iz2YXw3HckbOO4x/BlpA37QlMQcZkWh5g4h/TzuFThBdC3K8ry9zvO/i1e9GL7UcHadRuXkSQTMy+10F+EKnKezVEKAlZbf7Z7m1zZyNNksPMZ7NcQsXvPlc/xEiHcZFMXZVnPG4PnyuZ4ZIg5kc4kBbrBdRAacNVxXkG791YPZPnU++n72e5vtP2n+nxNRGOSMTuX6tf5QhV1Vgxd/HRwIDAQAB";
    }

    private RSAPublicKey getPublicKey(String base64PublicKey) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(base64PublicKey);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory factory = KeyFactory.getInstance("RSA");
        return (RSAPublicKey) factory.generatePublic(spec);
    }
}