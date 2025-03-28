package at.htlleonding.instaff.features.reservation;

import at.htlleonding.instaff.features.shift.Shift;
import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;
    String infos;
    int numberOfPeople;
    LocalTime startTime;
    LocalTime endTime;

    @ManyToOne
    Shift shift;
}
