export interface Assignment {
    id: number;
    shift: number;       // ID des zugeordneten Shifts
    role: number;        // ID der Rolle
    confirmed: boolean | null; // Status: true (bestätigt), false (abgelehnt), null (noch offen)
}