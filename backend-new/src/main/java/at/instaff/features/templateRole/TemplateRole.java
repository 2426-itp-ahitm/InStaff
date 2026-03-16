package at.instaff.features.templateRole;

import at.instaff.features.role.Role;
import at.instaff.features.shiftTemplate.ShiftTemplate;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "template_role")
public class TemplateRole extends PanacheEntity {
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    public Role role;

    @ManyToOne
    @JoinColumn(name = "shift_template_id")
    public ShiftTemplate shiftTemplate;

    public Integer count;
}
