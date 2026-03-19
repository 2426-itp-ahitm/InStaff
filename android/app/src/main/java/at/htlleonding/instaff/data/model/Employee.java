package at.htlleonding.instaff.data.model;

import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

public class Employee {
    private long id;
    private String keycloakUserId;
    private String firstname;
    private String lastname;
    private String email;
    private String telephone;
    @SerializedName(value = "birthDate", alternate = {"birthdate"})
    private String birthDate;
    private boolean isManager;
    private double hourlyWage;
    private String address;
    private Boolean isActive;
    private Company company;
    private List<Role> roles = new ArrayList<>();

    public long getId() {
        return id;
    }

    public String getKeycloakUserId() {
        return keycloakUserId;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public boolean isManager() {
        return isManager;
    }

    public double getHourlyWage() {
        return hourlyWage;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Company getCompany() {
        return company;
    }

    public boolean isActive() {
        return isActive == null || isActive;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public EmployeeUpdateRequest toUpdateRequest(String firstname, String lastname, String telephone, String birthDate, String address) {
        List<Long> roleIds = new ArrayList<>();
        for (Role role : roles) {
            roleIds.add(role.getId());
        }
        return new EmployeeUpdateRequest(
                firstname,
                lastname,
                email,
                telephone,
                birthDate,
                isManager,
                roleIds,
                hourlyWage,
                address,
                isActive()
        );
    }

    public static class EmployeeUpdateRequest {
        private final String firstname;
        private final String lastname;
        private final String email;
        private final String telephone;
        @SerializedName(value = "birthDate", alternate = {"birthdate"})
        private final String birthDate;
        private final boolean isManager;
        private final List<Long> roles;
        private final double hourlyWage;
        private final String address;
        private final boolean isActive;

        public EmployeeUpdateRequest(String firstname, String lastname, String email,
                                     String telephone, String birthDate, boolean isManager,
                                     List<Long> roles, double hourlyWage, String address, boolean isActive) {
            this.firstname = firstname;
            this.lastname = lastname;
            this.email = email;
            this.telephone = telephone;
            this.birthDate = birthDate;
            this.isManager = isManager;
            this.roles = roles;
            this.hourlyWage = hourlyWage;
            this.address = address;
            this.isActive = isActive;
        }
    }
}
