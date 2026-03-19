package at.htlleonding.instaff.data.api;

import java.util.List;

import at.htlleonding.instaff.data.model.Assignment;
import at.htlleonding.instaff.data.model.Employee;
import at.htlleonding.instaff.data.model.Role;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public interface InStaffApi {
    @GET("employees/keycloak/{id}")
    Call<Employee> getEmployeeByKeycloakId(@Path("id") String keycloakId);

    @GET("assignments/employee/{employeeId}")
    Call<List<Assignment>> getAssignmentsByEmployee(@Path("employeeId") long employeeId);

    @GET("roles")
    Call<List<Role>> getRoles();

    @PUT("assignments/{id}/confirm/{isConfirmed}")
    Call<Assignment> updateAssignmentStatus(@Path("id") long assignmentId, @Path("isConfirmed") boolean isConfirmed);

    @PUT("employees/{id}")
    Call<Employee> updateEmployee(@Path("id") long employeeId, @Body Employee.EmployeeUpdateRequest request);
}
