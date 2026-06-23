package at.htlleonding.instaff.features.reservation;

import java.time.LocalTime;

public record ReservationCreateDTO(
        String name,
        String infos,
        int numberOfPeople,
        LocalTime startTime,
        LocalTime endTime,
        Long shiftId
) {
}
