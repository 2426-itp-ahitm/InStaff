package at.htlleonding.instaff.data.model;

public class Assignment {
    private long id;
    private Boolean confirmed;
    private EmployeeSummary employee;
    private ShiftSummary shift;
    private Role role;

    public long getId() {
        return id;
    }

    public Boolean getConfirmed() {
        return confirmed;
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
