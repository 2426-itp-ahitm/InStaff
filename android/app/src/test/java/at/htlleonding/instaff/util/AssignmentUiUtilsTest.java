package at.htlleonding.instaff.util;

import org.junit.Test;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import at.htlleonding.instaff.data.model.Assignment;
import at.htlleonding.instaff.data.model.EmployeeSummary;
import at.htlleonding.instaff.data.model.Role;
import at.htlleonding.instaff.data.model.ShiftSummary;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class AssignmentUiUtilsTest {

    @Test
    public void nextSevenDaysUpcoming_filtersStartedAssignmentsOut() throws Exception {
        Assignment futureWithinRange = assignment(1, null, "2026-03-19T12:00:00", "2026-03-19T16:00:00");
        Assignment alreadyStarted = assignment(2, null, "2026-03-18T08:00:00", "2026-03-18T12:00:00");
        Assignment outsideRange = assignment(3, null, "2026-03-26T12:00:00", "2026-03-26T16:00:00");

        List<Assignment> result = AssignmentUiUtils.getUpcomingWithinNextSevenDays(
                List.of(futureWithinRange, alreadyStarted, outsideRange),
                LocalDate.of(2026, 3, 18),
                LocalDateTime.of(2026, 3, 18, 13, 0)
        );

        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getId());
    }

    @Test
    public void upcomingWithinThirtyDays_sortsAscending() throws Exception {
        Assignment later = assignment(1, null, "2026-03-25T12:00:00", "2026-03-25T16:00:00");
        Assignment sooner = assignment(2, null, "2026-03-20T12:00:00", "2026-03-20T16:00:00");

        List<Assignment> result = AssignmentUiUtils.getUpcomingWithinThirtyDays(
                List.of(later, sooner),
                LocalDateTime.of(2026, 3, 19, 10, 0)
        );

        assertEquals(2, result.get(0).getId());
        assertEquals(1, result.get(1).getId());
    }

    @Test
    public void pastWithinThirtyDays_sortsDescending() throws Exception {
        Assignment older = assignment(1, true, "2026-03-10T12:00:00", "2026-03-10T16:00:00");
        Assignment recent = assignment(2, false, "2026-03-18T12:00:00", "2026-03-18T16:00:00");

        List<Assignment> result = AssignmentUiUtils.getPastWithinThirtyDays(
                List.of(older, recent),
                LocalDateTime.of(2026, 3, 19, 10, 0)
        );

        assertEquals(2, result.get(0).getId());
        assertEquals(1, result.get(1).getId());
    }

    @Test
    public void isStarted_recognizesStartedAssignments() throws Exception {
        Assignment assignment = assignment(1, null, "2026-03-19T09:00:00", "2026-03-19T13:00:00");

        assertTrue(AssignmentUiUtils.isStarted(assignment, LocalDateTime.of(2026, 3, 19, 10, 0)));
        assertFalse(AssignmentUiUtils.isStarted(assignment, LocalDateTime.of(2026, 3, 19, 8, 0)));
    }

    private Assignment assignment(long id, Boolean confirmed, String start, String end) throws Exception {
        Assignment assignment = new Assignment();
        ShiftSummary shift = new ShiftSummary();
        setField(shift, "id", id);
        setField(shift, "shiftName", "Schicht " + id);
        setField(shift, "startTime", start);
        setField(shift, "endTime", end);

        Role role = new Role();
        setField(role, "id", 1L);
        setField(role, "roleName", "Kellner");
        setField(role, "description", "Service");

        EmployeeSummary employee = new EmployeeSummary();
        setField(employee, "id", 1L);
        setField(employee, "firstname", "Max");
        setField(employee, "lastname", "Mustermann");

        setField(assignment, "id", id);
        setField(assignment, "confirmed", confirmed);
        setField(assignment, "shift", shift);
        setField(assignment, "role", role);
        setField(assignment, "employee", employee);
        return assignment;
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }
}
