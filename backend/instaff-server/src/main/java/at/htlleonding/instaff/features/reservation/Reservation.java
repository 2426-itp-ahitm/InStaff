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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInfos() {
        return infos;
    }

    public void setInfos(String infos) {
        this.infos = infos;
    }

    public int getNumberOfPeople() {
        return numberOfPeople;
    }

    public void setNumberOfPeople(int numberOfPeople) {
        this.numberOfPeople = numberOfPeople;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Shift getShift() {
        return shift;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }
}
