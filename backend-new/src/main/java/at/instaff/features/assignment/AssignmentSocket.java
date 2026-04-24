package at.instaff.features.assignment;

import at.instaff.features.employee.Employee;
import at.instaff.features.security.CustomSocketConfigurator;
import io.quarkus.narayana.jta.QuarkusTransaction;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.infrastructure.Infrastructure;
import io.vertx.core.json.Json;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;

import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.List;

@ServerEndpoint(value = "/ws/assignments", configurator = CustomSocketConfigurator.class)
@ApplicationScoped
public class AssignmentSocket {

    private Set<Session> sessions = new CopyOnWriteArraySet<>();

    @OnOpen
    public void onOpen(Session session, EndpointConfig config) {
        String userId = (String) config.getUserProperties().get("userId");

        System.out.println("Socket opened, userId = " + userId);

        Uni.createFrom().item(() -> loadSocketData(userId))
                .runSubscriptionOn(Infrastructure.getDefaultExecutor())
                .subscribe().with(
                        data -> {
                            session.getUserProperties().put("companyId", data.companyId());
                            session.getUserProperties().put("isManager", data.isManager());
                            sessions.add(session);

                            session.getAsyncRemote().sendText("connected");

                            for (String message : data.initialMessages()) {
                                session.getAsyncRemote().sendText(message);
                            }

                            System.out.println("Socket session added, companyId = " + data.companyId() + ", isManager = " + data.isManager());
                            System.out.println("Initial assignment news sent: " + data.initialMessages().size());
                        },
                        failure -> {
                            failure.printStackTrace();
                            try {
                                session.close(new CloseReason(CloseReason.CloseCodes.CANNOT_ACCEPT, "Socket initialization failed"));
                            } catch (Exception ignored) {
                            }
                        }
                );
    }

    private SocketData loadSocketData(String userId) {
        return QuarkusTransaction.requiringNew().call(() -> {
            Object[] result = Employee.getEntityManager()
                    .createQuery("select e.company.id, e.isManager from Employee e where e.keycloakUserId = :id", Object[].class)
                    .setParameter("id", userId)
                    .getSingleResult();

            Long companyId = (Long) result[0];
            Boolean isManager = (Boolean) result[1];

            List<String> initialMessages = List.of();

            if (Boolean.TRUE.equals(isManager)) {
                initialMessages = Assignment.find(
                                "shift.company.id = ?1 and status <> ?2 and seen = false",
                                companyId,
                                AssignmentStatus.PENDING
                        )
                        .<Assignment>list()
                        .stream()
                        .map(assignment -> Json.encode(AssignmentDTO.toResource(assignment)))
                        .toList();
            }

            return new SocketData(companyId, isManager, initialMessages);
        });
    }

    private record SocketData(Long companyId, Boolean isManager, List<String> initialMessages) {
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

    public void broadcastAssignments(Assignment assignment) {
        if (assignment.status == AssignmentStatus.PENDING || assignment.seen) {
            return;
        }

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

}
