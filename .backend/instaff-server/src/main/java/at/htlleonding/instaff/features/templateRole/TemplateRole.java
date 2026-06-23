package at.htlleonding.instaff.features.templateRole;

import at.htlleonding.instaff.features.role.Role;
import at.htlleonding.instaff.features.shiftTemplate.ShiftTemplate;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "template_role")
public class TemplateRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne()
    @OnDelete(action = OnDeleteAction.CASCADE)
    Role role;

    @ManyToOne()
    @JoinColumn(name = "shift_template_id")
    ShiftTemplate shiftTemplate;

    Integer count;

    public TemplateRole() {}

    public TemplateRole(Role role, ShiftTemplate shiftTemplate, Integer count) {
        this.role = role;
        this.shiftTemplate = shiftTemplate;
        this.count = count;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public ShiftTemplate getShiftTemplate() {
        return shiftTemplate;
    }

    public void setShiftTemplate(ShiftTemplate shiftTemplate) {
        this.shiftTemplate = shiftTemplate;
    }
}
