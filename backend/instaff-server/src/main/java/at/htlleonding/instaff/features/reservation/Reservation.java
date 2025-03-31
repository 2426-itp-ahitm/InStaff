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

    public Reservation() {}

    public Reservation(String name, String infos, int numberOfPeople, LocalTime startTime, LocalTime endTime, Shift shift) {
        this.name = name;
        this.infos = infos;
        this.numberOfPeople = numberOfPeople;
        this.startTime = startTime;
        this.endTime = endTime;
        this.shift = shift;
    }
}
