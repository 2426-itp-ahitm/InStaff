import { Reservation } from "src/interfaces/reservation";
import { model } from "Model/model";

const BASE_URL = '/api'

export async function loadAllReservation() {
   const response = await fetch(`${BASE_URL}/reservations`);
   const reservations: Reservation[] = await response.json();
   model.reservations = reservations;
}

export async function loadReservation(id: number) {
   const response = await fetch(`${BASE_URL}/reservations/${id}`);
   const reservation: Reservation = await response.json();
   return reservation;
}