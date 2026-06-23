package at.instaff.features.company.openingHour;

import at.instaff.features.company.Company;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class CompanyOpeningHour extends PanacheEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "company_id")
    public Company company;

    @Enumerated(EnumType.STRING)
    @Column(name = "weekday", nullable = false)
    public DayOfWeek weekday;

    @Column(name = "is_closed", nullable = false)
    public boolean isClosed;

    @Column(name = "start_time")
    public LocalTime startTime;

    @Column(name = "end_time")
    public LocalTime endTime;

    public CompanyOpeningHour() {}
}
