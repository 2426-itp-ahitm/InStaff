package at.htlleonding.instaff.ui.shifts;

import at.htlleonding.instaff.data.model.Assignment;

public class AssignmentListItem {
    public enum Type {
        HEADER,
        ASSIGNMENT
    }

    private final Type type;
    private final String headerTitle;
    private final Assignment assignment;

    private AssignmentListItem(Type type, String headerTitle, Assignment assignment) {
        this.type = type;
        this.headerTitle = headerTitle;
        this.assignment = assignment;
    }

    public static AssignmentListItem header(String title) {
        return new AssignmentListItem(Type.HEADER, title, null);
    }

    public static AssignmentListItem assignment(Assignment assignment) {
        return new AssignmentListItem(Type.ASSIGNMENT, null, assignment);
    }

    public Type getType() {
        return type;
    }

    public String getHeaderTitle() {
        return headerTitle;
    }

    public Assignment getAssignment() {
        return assignment;
    }
}
