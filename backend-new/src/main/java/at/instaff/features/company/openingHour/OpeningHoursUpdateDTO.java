package at.instaff.features.company.openingHour;

import java.util.List;

public record OpeningHoursUpdateDTO(
        List<OpeningHourCreateDTO> openingHours
) {
}
