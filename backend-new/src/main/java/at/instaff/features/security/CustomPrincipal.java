package at.instaff.features.security;

import javax.security.auth.Subject;
import java.security.Principal;

public class CustomPrincipal implements Principal {

    private final String name;
    private final long companyId;
    private final long employeeId;

    public CustomPrincipal(String name, long companyId, long employeeId) {
        this.name = name;
        this.companyId = companyId;
        this.employeeId = employeeId;
    }

    public long getEmployeeId() {
        return employeeId;
    }

    public long getCompanyId() {
        return companyId;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public boolean implies(Subject subject) {
        return Principal.super.implies(subject);
    }
}
