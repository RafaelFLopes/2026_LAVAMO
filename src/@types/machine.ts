export interface Reservation {
    userId: string;
    username: string;
    reservedAt: string;
    // Só no Android (SQLite): quando a reserva é cancelada automaticamente.
    expiresAt?: string;
}

export interface Machine {
    code: string;
    model: string;
    year: number;
    available: boolean;
    reservedBy: Reservation | null;
}
