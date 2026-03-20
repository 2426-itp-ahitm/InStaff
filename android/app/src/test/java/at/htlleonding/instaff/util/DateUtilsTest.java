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
    public void overlapsNextSevenDays_detectsOverlapCorrectly() {
        assertTrue(DateUtils.overlapsNextSevenDays("2026-03-20T10:00:00", "2026-03-20T15:00:00", LocalDate.of(2026, 3, 18)));
        assertTrue(DateUtils.overlapsNextSevenDays("2026-03-24T10:00:00", "2026-03-25T15:00:00", LocalDate.of(2026, 3, 18)));
        assertFalse(DateUtils.overlapsNextSevenDays("2026-03-10T10:00:00", "2026-03-10T15:00:00", LocalDate.of(2026, 3, 18)));
        assertFalse(DateUtils.overlapsNextSevenDays("2026-03-26T10:00:00", "2026-03-26T15:00:00", LocalDate.of(2026, 3, 18)));
    }
}
