package at.htlleonding.instaff.data.model;

public class Assignment {
    private long id;
    private AssignmentStatus status;
    private EmployeeSummary employee;
    private ShiftSummary shift;
    private Role role;

    public long getId() {
        return id;
    }

    public AssignmentStatus getStatus() {
        return status;
    }

    public EmployeeSummary getEmployee() {
        return employee;
    }

    public ShiftSummary getShift() {
        return shift;
    }

    public Role getRole() {
        return role;
    }
}
