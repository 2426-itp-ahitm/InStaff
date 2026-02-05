package at.htlleonding.instaff.features.shiftTemplate;

import at.htlleonding.instaff.features.company.Company;
import at.htlleonding.instaff.features.role.Role;
import at.htlleonding.instaff.features.templateRole.TemplateRole;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "shift_template")
public class ShiftTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(name = "shift_template_name")
    String shiftTemplateName;
    @ManyToOne
    Company company;

    @OneToMany(mappedBy = "shiftTemplate", cascade = CascadeType.ALL)
    List<TemplateRole> templateRoles;

    public ShiftTemplate() {
    }

    public ShiftTemplate(String shiftTemplateName, Company company) {
        this.shiftTemplateName = shiftTemplateName;
        this.company = company;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getShiftTemplateName() {
        return shiftTemplateName;
    }

    public void setShiftTemplateName(String shiftTemplateName) {
        this.shiftTemplateName = shiftTemplateName;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public List<TemplateRole> getTemplateRoles() {
        return templateRoles;
    }

    public void setTemplateRoles(List<TemplateRole> templateRoles) {
        this.templateRoles = templateRoles;
    }
}
