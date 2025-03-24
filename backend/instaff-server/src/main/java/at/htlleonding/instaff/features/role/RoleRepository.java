package at.htlleonding.instaff.features.role;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class RoleRepository implements PanacheRepository<Role> {

}
