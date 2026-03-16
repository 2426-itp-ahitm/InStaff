package at.instaff.features.shiftTemplate;

import at.instaff.features.company.Company;
import at.instaff.features.templateRole.TemplateRole;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "shift_template")
public class ShiftTemplate extends PanacheEntity {
    @Column(name = "shift_template_name")
    public String shiftTemplateName;

    @ManyToOne
    public Company company;

    @OneToMany(mappedBy = "shiftTemplate")
    public List<TemplateRole> templateRoles;
}
