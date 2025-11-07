package at.htlleonding.instaff.features.news;

import at.htlleonding.instaff.features.assignment.Assignment;
import at.htlleonding.instaff.features.company.Company;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@NamedQueries({
        @NamedQuery(name = News.FIND_BY_COMPANY, query = "select n from News n WHERE n.company.id = :id"),
})

@Entity
public class News {
    public static final String FIND_BY_COMPANY = "News.findByCompany";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_created")
    LocalDateTime dateCreated;

    @ManyToOne
    Assignment assignment;

    @Column(name = "assignment_status")
    Boolean assignmentStatus;

    @ManyToOne
    Company company;

    public News() {
        this.dateCreated = LocalDateTime.now();
    }

    public News(Assignment assignment, Company company) {
        this.assignment = assignment;
        this.assignmentStatus = assignment.getConfirmed();
        this.company = company;
        this.dateCreated = LocalDateTime.now();
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getAssignmentStatus() {
        return assignmentStatus;
    }

    public void setAssignmentStatus(Boolean assignmentStatus) {
        this.assignmentStatus = assignmentStatus;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Assignment getAssignment() {
        return assignment;
    }

    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }
}
