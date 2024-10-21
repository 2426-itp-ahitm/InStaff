package at.htlleonding.instaff.repository;

import at.htlleonding.instaff.model.Manager;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.*;

@ApplicationScoped
public class ManagerRespository {
    private Map<Integer, Manager> managers;

    public ManagerRespository() {this.managers = new HashMap<>();}

    public Manager getManager(int managerId) {
        return this.managers.get(managerId);
    }

    public int getNextId() {
        return managers.size();
    }

    public void addManager (Manager manager) {
        if (this.getManager(manager.getManagerId()) != null) {
            throw new IllegalArgumentException("Manager already exists");
        }
        this.managers.put(manager.getManagerId(), manager);
    }

    public List<Manager> getAllManagers() {
        return new LinkedList<>(this.managers.values());
    }
}
