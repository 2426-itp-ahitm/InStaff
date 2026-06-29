package at.instaff.features.companySetupInvite;

import at.instaff.features.security.CustomSocketConfigurator;
import io.vertx.core.json.Json;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.CloseReason;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint(value = "/ws/company-setup-invites", configurator = CustomSocketConfigurator.class)
@ApplicationScoped
public class CompanySetupInviteSocket {
    private final Set<Session> sessions = new CopyOnWriteArraySet<>();

    @OnOpen
    public void onOpen(Session session, EndpointConfig config) {
        List<String> roles = getRoles(config);

        if (!roles.contains("user-is-internal-admin")) {
            try {
                session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Missing internal admin role"));
            } catch (Exception ignored) {
            }
            return;
        }

        sessions.add(session);
        session.getAsyncRemote().sendText("connected");
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        sessions.remove(session);
        throwable.printStackTrace();
    }

    public void broadcastInvites() {
        String message = Json.encode(loadInvites());

        for (Session session : sessions) {
            session.getAsyncRemote().sendText(message);
        }
    }

    private List<CompanySetupDTO> loadInvites() {
        return CompanySetupInvite.findAll()
                .stream()
                .map(invite -> CompanySetupDTO.toResource((CompanySetupInvite) invite))
                .toList();
    }

    @SuppressWarnings("unchecked")
    private List<String> getRoles(EndpointConfig config) {
        Object roles = config.getUserProperties().get("roles");

        if (roles instanceof List<?>) {
            return ((List<?>) roles).stream().map(String::valueOf).toList();
        }

        return List.of();
    }
}
