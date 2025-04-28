export interface Assignment {
    id: number;
    employee: number;
    role: number;
    confirmed: boolean | null; // null = pending, true = confirmed, false = declined
    shift: number;
}