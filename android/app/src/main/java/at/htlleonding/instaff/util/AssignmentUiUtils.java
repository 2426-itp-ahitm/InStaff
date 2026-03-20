package at.htlleonding.instaff.util;

import androidx.annotation.NonNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import at.htlleonding.instaff.data.model.Assignment;

public final class AssignmentUiUtils {
    public static final String SECTION_UPCOMING = "upcoming";
    public static final String SECTION_PAST = "past";

    private AssignmentUiUtils() {
    }

    public static boolean isPast(@NonNull Assignment assignment, @NonNull LocalDateTime now) {
        return DateUtils.parseDateTime(assignment.getShift().getEndTime()).isBefore(now);
    }

    public static boolean isStarted(@NonNull Assignment assignment, @NonNull LocalDateTime now) {
        return !DateUtils.parseDateTime(assignment.getShift().getStartTime()).isAfter(now);
    }

    public static List<Assignment> getUpcomingWithinNextSevenDays(@NonNull List<Assignment> assignments, @NonNull LocalDate today, @NonNull LocalDateTime now) {
        List<Assignment> filtered = new ArrayList<>();
        for (Assignment assignment : assignments) {
            boolean overlapsNextSevenDays = DateUtils.overlapsNextSevenDays(
                    assignment.getShift().getStartTime(),
                    assignment.getShift().getEndTime(),
                    today
            );
            if (overlapsNextSevenDays && !isStarted(assignment, now)) {
                filtered.add(assignment);
            }
        }
        filtered.sort(Comparator.comparing(item -> DateUtils.parseDateTime(item.getShift().getStartTime())));
        return filtered;
    }

    public static List<Assignment> getUpcomingWithinThirtyDays(@NonNull List<Assignment> assignments, @NonNull LocalDateTime now) {
        LocalDateTime limit = now.plusDays(30);
        List<Assignment> filtered = new ArrayList<>();
        for (Assignment assignment : assignments) {
            LocalDateTime start = DateUtils.parseDateTime(assignment.getShift().getStartTime());
            if (!start.isBefore(now) && !start.isAfter(limit)) {
                filtered.add(assignment);
            }
        }
        filtered.sort(Comparator.comparing(item -> DateUtils.parseDateTime(item.getShift().getStartTime())));
        return filtered;
    }

    public static List<Assignment> getPastWithinThirtyDays(@NonNull List<Assignment> assignments, @NonNull LocalDateTime now) {
        LocalDateTime limit = now.minusDays(30);
        List<Assignment> filtered = new ArrayList<>();
        for (Assignment assignment : assignments) {
            LocalDateTime start = DateUtils.parseDateTime(assignment.getShift().getStartTime());
            if (start.isBefore(now) && !start.isBefore(limit)) {
                filtered.add(assignment);
            }
        }
        filtered.sort((left, right) -> DateUtils.parseDateTime(right.getShift().getStartTime())
                .compareTo(DateUtils.parseDateTime(left.getShift().getStartTime())));
        return filtered;
    }
}
