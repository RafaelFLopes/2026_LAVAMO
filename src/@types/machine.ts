export interface Reservation {
    userId: string;
    username: string;
    reservedAt: string;
}

export interface Machine {
    code: string;
    model: string;
    year: number;
    available: boolean;
    reservedBy: Reservation | null;
}
