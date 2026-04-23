package at.htlleonding.instaff.util;

import androidx.annotation.NonNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import at.htlleonding.instaff.data.model.Assignment;
import at.htlleonding.instaff.data.model.AssignmentStatus;

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

    @NonNull
    public static AssignmentStatus normalizedStatus(AssignmentStatus status) {
        return status != null ? status : AssignmentStatus.PENDING;
    }

    public static boolean isOpenStatus(AssignmentStatus status) {
        AssignmentStatus normalized = normalizedStatus(status);
        return normalized == AssignmentStatus.PENDING || normalized == AssignmentStatus.REQUESTED;
    }

    public static boolean isAcceptedStatus(AssignmentStatus status) {
        AssignmentStatus normalized = normalizedStatus(status);
        return normalized == AssignmentStatus.CONFIRMED || normalized == AssignmentStatus.REQUEST_CONFIRMED;
    }

    public static boolean isDeclinedStatus(AssignmentStatus status) {
        AssignmentStatus normalized = normalizedStatus(status);
        return normalized == AssignmentStatus.DECLINED || normalized == AssignmentStatus.REQUEST_DECLINED;
    }

    public static boolean canAccept(AssignmentStatus status, boolean isPast) {
        return !isPast && !isAcceptedStatus(status);
    }

    public static boolean canDecline(AssignmentStatus status, boolean isPast) {
        return !isPast && !isDeclinedStatus(status);
    }
}
