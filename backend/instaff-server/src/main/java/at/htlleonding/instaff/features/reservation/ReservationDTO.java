package at.htlleonding.instaff.features.reservation;

import java.time.LocalTime;

public record ReservationDTO(
        Long id,
        String name,
        String infos,
        int number_of_people,
        LocalTime start_time,
        LocalTime end_time,
        Long shift
) {
}
