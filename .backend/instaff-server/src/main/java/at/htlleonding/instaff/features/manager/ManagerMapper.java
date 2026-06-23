package at.htlleonding.instaff.features.manager;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ManagerMapper {
    public ManagerDTO toResource(final Manager manager) {
        return new ManagerDTO(manager.id, manager.firstname, manager.lastname, manager.email, manager.telephone, manager.password, manager.birthdate, manager.company.getId(),
                manager.company.getCompanyName());
    }
}
