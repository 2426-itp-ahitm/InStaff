package at.htlleonding.instaff.features.reservation;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("{companyId}/reservations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReservationResource {
    @Inject
    ReservationRepository reservationRepository;
    @Inject
    ReservationMapper reservationMapper;

    @GET
    public List<ReservationDTO> all(@PathParam("companyId") Long companyId) {
        var reservations = reservationRepository.getByCompanyId(companyId);
        return reservations
                .stream()
                .map(reservationMapper::toResource)
                .toList();
    }

    @GET
    @Path("company/{companyId}")
    public Response getByCompanyId(@PathParam("companyId") long companyId) {
        List<Reservation> reservations = reservationRepository.getByCompanyId(companyId);
        return Response.ok(
                reservations.stream().map(reservationMapper::toResource).toList()
        ).build();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        return Response.ok(reservationMapper.toResource(reservationRepository.findById(id))).build();
    }

    @POST
    @Transactional
    public Response create(ReservationCreateDTO dto) {
        Reservation reservation = reservationRepository.create(dto);
        return Response.status(Response.Status.CREATED).entity(reservationMapper.toResource(reservation)).build();
    }

    @POST
    @Transactional
    @Path("/delete/{id}")
    public Response delete(@PathParam("id") Long id) {
        Reservation reservation = reservationRepository.findById(id);
        if (reservation == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        reservationRepository.delete(reservation);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

}
