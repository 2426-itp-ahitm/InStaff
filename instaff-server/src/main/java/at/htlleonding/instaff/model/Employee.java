package at.htlleonding.instaff.model;

public class Employee {
    private int employeeId;
    private String employeeName;
    private String employeeEmail;
    private String employeePassword;
    private String employeePhoneNumber;
    private String employeeBirthdate;
    private String employeeSalary;
    private Company company;

    public Employee(int employeeId, String employeeName, String employeePassword) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeePassword = employeePassword;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public String getEmployeePassword() {
        return employeePassword;
    }

    public String getEmployeePhoneNumber() {
        return employeePhoneNumber;
    }

    public String getEmployeeBirthdate() {
        return employeeBirthdate;
    }

    public String getEmployeeSalary() {
        return employeeSalary;
    }

    public Company getCompany() {
        return company;
    }
}
