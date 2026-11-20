import type { SQLiteDatabase } from 'expo-sqlite';
import { Machine } from '@/@types/machine';
import { User } from '@/@types/user';
import { getDatabase } from './database';
import { MachineError, normalizeCode } from './machineRules';
import { cancelScheduledNotification, scheduleReservationExpiredNotification } from './notificationIntegration';

export { MACHINE_CODE_PATTERN, MachineError, normalizeCode } from './machineRules';

// Versão ANDROID: os dados ficam no SQLite (veja database.ts).
// A Web usa o machineIntegration.web.ts (AsyncStorage). As duas exportam as mesmas
// funções com o mesmo retorno, então as telas não sabem qual está rodando.

// Regra de negócio (só Android): a reserva é cancelada sozinha depois deste tempo.
// 1 minuto para dar para ver acontecendo na apresentação.
const RESERVATION_DURATION_MS = 60 * 1000;

type MachineRow = {
  code: string;
  model: string;
  year: number;
  user_id: string | null;
  username: string | null;
  reserved_at: number | null;
  expires_at: number | null;
};

// A máquina junto com a reserva ATIVA dela (se houver). "available" não é uma
// coluna: a máquina está livre quando não existe reserva ativa.
const SELECT_MACHINE = `
  SELECT m.code, m.model, m.year, r.user_id, u.username, r.reserved_at, r.expires_at
  FROM machines m
  LEFT JOIN reservations r ON r.machine_code = m.code AND r.ended_at IS NULL
  LEFT JOIN users u ON u.user_id = r.user_id
`;

function toMachine(row: MachineRow): Machine {
  const isReserved = row.user_id !== null && row.reserved_at !== null && row.expires_at !== null;
  return {
    code: row.code,
    model: row.model,
    year: row.year,
    available: !isReserved,
    reservedBy: isReserved
      ? {
          userId: row.user_id!,
          username: row.username ?? '',
          reservedAt: new Date(row.reserved_at!).toISOString(),
          expiresAt: new Date(row.expires_at!).toISOString(),
        }
      : null,
  };
}

// Encerra as reservas cujo tempo acabou. Roda antes de toda leitura e escrita,
// então o app nunca mostra uma reserva vencida, mesmo que tenha ficado fechado.
// O aviso ao usuário já foi agendado no Android na hora da reserva.
async function expireOverdueReservations(db: SQLiteDatabase, now: number): Promise<void> {
  await db.runAsync(
    `UPDATE reservations SET ended_at = expires_at, end_reason = 'expired'
     WHERE ended_at IS NULL AND expires_at <= ?`,
    now
  );
}

async function findOrFail(db: SQLiteDatabase, code: string): Promise<Machine> {
  const row = await db.getFirstAsync<MachineRow>(`${SELECT_MACHINE} WHERE m.code = ?`, code);
  if (!row) {
    throw new MachineError(`Máquina ${code} não encontrada.`);
  }
  return toMachine(row);
}

export const getMachineByCode = async (code: string): Promise<Machine> => {
  const db = await getDatabase();
  await expireOverdueReservations(db, Date.now());
  return findOrFail(db, normalizeCode(code));
};

export const getMyReservation = async (userId: string): Promise<Machine | null> => {
  const db = await getDatabase();
  await expireOverdueReservations(db, Date.now());
  const row = await db.getFirstAsync<MachineRow>(`${SELECT_MACHINE} WHERE r.user_id = ?`, userId);
  return row ? toMachine(row) : null;
};

export const reserveMachine = async (code: string, user: User): Promise<Machine> => {
  const db = await getDatabase();
  const machineCode = normalizeCode(code);
  const now = Date.now();
  const expiresAt = now + RESERVATION_DURATION_MS;
  let reservationId = 0;

  // Transação exclusiva: as verificações e a gravação acontecem juntas, sem nada no meio.
  // Se uma regra falhar (throw), nada é gravado.
  await db.withExclusiveTransactionAsync(async (txn) => {
    await expireOverdueReservations(txn, now);
    const machine = await findOrFail(txn, machineCode);

    if (machine.reservedBy) {
      throw new MachineError(`A máquina ${machine.code} já está em uso por ${machine.reservedBy.username}.`);
    }

    const current = await txn.getFirstAsync<{ machine_code: string }>(
      'SELECT machine_code FROM reservations WHERE user_id = ? AND ended_at IS NULL',
      user.userId
    );
    if (current) {
      throw new MachineError(`Você já está usando a máquina ${current.machine_code}. Cancele a reserva antes de usar outra.`);
    }

    // Guarda (ou atualiza) o usuário que veio da API de login.
    await txn.runAsync(
      `INSERT INTO users (user_id, username) VALUES (?, ?)
       ON CONFLICT (user_id) DO UPDATE SET username = excluded.username`,
      user.userId, user.username
    );

    const result = await txn.runAsync(
      'INSERT INTO reservations (machine_code, user_id, reserved_at, expires_at) VALUES (?, ?, ?, ?)',
      machineCode, user.userId, now, expiresAt
    );
    reservationId = result.lastInsertRowId;
  });

  // Fora da transação: agendar pode abrir a janela de permissão do Android.
  const notificationId = await scheduleReservationExpiredNotification(machineCode, new Date(expiresAt));
  if (notificationId) {
    await db.runAsync('UPDATE reservations SET notification_id = ? WHERE id = ?', notificationId, reservationId);
  }

  return findOrFail(db, machineCode);
};

export const cancelReservation = async (code: string, userId: string): Promise<Machine> => {
  const db = await getDatabase();
  const machineCode = normalizeCode(code);
  const now = Date.now();
  let notificationId: string | null = null;

  await db.withExclusiveTransactionAsync(async (txn) => {
    await expireOverdueReservations(txn, now);
    await findOrFail(txn, machineCode);

    const active = await txn.getFirstAsync<{ id: number; user_id: string; notification_id: string | null }>(
      'SELECT id, user_id, notification_id FROM reservations WHERE machine_code = ? AND ended_at IS NULL',
      machineCode
    );
    if (!active) {
      throw new MachineError('Esta máquina não está reservada. O tempo da reserva pode já ter acabado.');
    }
    if (active.user_id !== userId) {
      throw new MachineError('Só quem reservou a máquina pode cancelar a reserva.');
    }

    await txn.runAsync(
      `UPDATE reservations SET ended_at = ?, end_reason = 'cancelled' WHERE id = ?`,
      now, active.id
    );
    notificationId = active.notification_id;
  });

  // Cancelou na mão: o aviso de "tempo encerrado" não deve mais chegar.
  await cancelScheduledNotification(notificationId);

  return findOrFail(db, machineCode);
};
