package at.instaff.features.company.openingHour;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record OpeningHourCreateDTO(
        DayOfWeek weekday,
        boolean isClosed,
        LocalTime startTime,
        LocalTime endTime
) {
    public static OpeningHourCreateDTO toResource(CompanyOpeningHour openingHour) {
        return new OpeningHourCreateDTO(openingHour.weekday, openingHour.isClosed, openingHour.startTime, openingHour.endTime);
    }
}
