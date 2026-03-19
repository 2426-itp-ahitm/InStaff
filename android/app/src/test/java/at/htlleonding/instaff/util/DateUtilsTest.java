package at.htlleonding.instaff.util;

import org.junit.Test;

import java.time.LocalDate;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class DateUtilsTest {

    @Test
    public void formatShiftRange_sameDay_usesCompactFormat() {
        String formatted = DateUtils.formatShiftRange("2026-01-01T10:00:00", "2026-01-01T15:00:00");

        assertEquals("01.01.2026 10:00 - 15:00", formatted);
    }

    @Test
    public void formatShiftRange_multiDay_usesFullDateFormat() {
        String formatted = DateUtils.formatShiftRange("2026-01-01T20:00:00", "2026-01-02T03:00:00");

        assertEquals("01.01.2026 20:00 - 02.01.2026 03:00", formatted);
    }

    @Test
    public void overlapsCurrentWeek_detectsOverlapCorrectly() {
        assertTrue(DateUtils.overlapsCurrentWeek("2026-03-16T10:00:00", "2026-03-17T15:00:00", LocalDate.of(2026, 3, 18)));
        assertFalse(DateUtils.overlapsCurrentWeek("2026-03-10T10:00:00", "2026-03-10T15:00:00", LocalDate.of(2026, 3, 18)));
    }
}
