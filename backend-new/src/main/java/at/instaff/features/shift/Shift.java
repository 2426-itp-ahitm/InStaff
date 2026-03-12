package at.instaff.features.shift;

import at.instaff.features.assignment.Assignment;
import at.instaff.features.company.Company;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Shift extends PanacheEntity {
    @Column(name = "shift_name")
    public String shiftName;
    @Column(name = "start_time")
    public LocalDateTime startTime;
    @Column(name = "end_time")
    public LocalDateTime endTime;

    @ManyToOne
    public Company company;

    @OneToMany(mappedBy = "shift")
    List<Assignment> assignments;
}
