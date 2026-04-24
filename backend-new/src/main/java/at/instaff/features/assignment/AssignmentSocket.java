package at.instaff.features.assignment;

import at.instaff.features.employee.Employee;
import at.instaff.features.security.CustomSocketConfigurator;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.infrastructure.Infrastructure;
import io.vertx.core.json.Json;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;

import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint(value = "/ws/assignments", configurator = CustomSocketConfigurator.class)
@ApplicationScoped
public class AssignmentSocket {

    private Set<Session> sessions = new CopyOnWriteArraySet<>();

    @OnOpen
    @Transactional
    public void onOpen(Session session, EndpointConfig config) {
        String userId = (String) config.getUserProperties().get("userId");

        System.out.println("Socket opened, userId = " + userId);

        Long companyId = Employee.getEntityManager()
                .createQuery("select company.id from Employee where keycloakUserId = :id", Long.class)
                .setParameter("id", userId)
                .getSingleResult();

        session.getUserProperties().put("companyId", companyId);
        sessions.add(session);

        session.getAsyncRemote().sendText("connected");

        System.out.println("Socket session added, companyId = " + companyId);
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

    public void assignmentUpdated(Assignment assignment) {
        Long companyId = assignment.shift.company.id;

        for (Session session : sessions) {
            Long sessionCompanyId = (Long) session.getUserProperties().get("companyId");

            if (companyId.equals(sessionCompanyId)) {
                session.getAsyncRemote().sendText(
                        Json.encode(AssignmentDTO.toResource(assignment))
                );
            }
        }
    }

    public void assignmentSeen(Assignment assignment) {
        Long companyId = assignment.shift.company.id;

        for (Session session : sessions) {
            Long sessionCompanyId = (Long) session.getUserProperties().get("companyId");

            if (companyId.equals(sessionCompanyId)) {
                session.getAsyncRemote().sendText("seen " + assignment.id);
            }
        }
    }

    public void broadcast(String message) {
        for (Session session : sessions) {
            session.getAsyncRemote().sendText(message);
        }
    }
}
