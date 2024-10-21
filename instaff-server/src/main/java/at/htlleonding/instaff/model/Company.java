package at.htlleonding.instaff.model;

public class Company {
    private int companyId;
    private String companyName;

    public Company(int companyId, String companyName) {
        this.companyId = companyId;
        this.companyName = companyName;
    }

    public int getCompanyId() {
        return companyId;
    }

    public String getCompanyName() {
        return companyName;
    }
}
