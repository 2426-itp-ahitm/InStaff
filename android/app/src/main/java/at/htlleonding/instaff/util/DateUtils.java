package at.htlleonding.instaff.util;

import android.text.TextUtils;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public final class DateUtils {
    private static final DateTimeFormatter API_DATE_TIME = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    private DateUtils() {
    }

    public static LocalDateTime parseDateTime(String value) {
        return LocalDateTime.parse(value, API_DATE_TIME);
    }

    public static String formatShiftRange(String start, String end) {
        LocalDateTime startDateTime = parseDateTime(start);
        LocalDateTime endDateTime = parseDateTime(end);

        if (startDateTime.toLocalDate().equals(endDateTime.toLocalDate())) {
            return DATE_FORMAT.format(startDateTime) + " " + TIME_FORMAT.format(startDateTime) + " - " + TIME_FORMAT.format(endDateTime);
        }

        return DATE_FORMAT.format(startDateTime) + " " + TIME_FORMAT.format(startDateTime) + " - "
                + DATE_FORMAT.format(endDateTime) + " " + TIME_FORMAT.format(endDateTime);
    }

    public static boolean overlapsNextSevenDays(String start, String end, LocalDate today) {
        LocalDate startDate = parseDateTime(start).toLocalDate();
        LocalDate endDate = parseDateTime(end).toLocalDate();
        LocalDate rangeEnd = today.plusDays(6);
        return !endDate.isBefore(today) && !startDate.isAfter(rangeEnd);
    }

    public static String formatBirthDate(String birthDate) {
        if (TextUtils.isEmpty(birthDate)) {
            return "";
        }
        return DATE_FORMAT.format(LocalDate.parse(birthDate));
    }

    public static String toApiBirthDate(LocalDate date) {
        return date.toString();
    }

    public static String formatHourlyWage(double wage) {
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.GERMANY);
        DecimalFormat decimalFormat = new DecimalFormat("0.00", symbols);
        return decimalFormat.format(wage);
    }

    public static LocalDate parseBirthDate(String birthDate) {
        if (TextUtils.isEmpty(birthDate)) {
            return null;
        }
        return LocalDate.parse(birthDate);
    }
}
