package at.htlleonding.instaff.model;

public class Manager {
    private int managerId;
    private String managerName;
    public String managerEmail;
    private String managerPassword;
    private int companyId;

    public Manager(int managerId, String managerName, String managerPassword, int companyId) {
        this.managerId = managerId;
        this.managerName = managerName;
        this.managerPassword = managerPassword;
        this.companyId = companyId;
    }

    public int getManagerId() {
        return managerId;
    }

    public String getManagerName() {
        return managerName;
    }

    public String getManagerPassword() {
        return managerPassword;
    }

    public int getCompanyId() {
        return companyId;
    }
}
