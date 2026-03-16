package at.instaff.features.news;

import at.instaff.features.assignment.Assignment;
import at.instaff.features.company.Company;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
public class News extends PanacheEntity {
    @Column(name = "date_created")
    public LocalDateTime dateCreated;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "assignment_id", nullable = false)
    public Assignment assignment;

    @Column(name = "assignment_status")
    public Boolean assignmentStatus;

    @ManyToOne
    public Company company;
}
