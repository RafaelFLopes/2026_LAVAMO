import * as SQLite from 'expo-sqlite';
import seed from '../../bd.json';

// Banco SQLite do app ANDROID (a Web continua com AsyncStorage).
// O arquivo lavamo.db fica na área privada do app. O bd.json continua sendo
// a carga inicial das máquinas, copiada para a tabela "machines".
const DATABASE_NAME = 'lavamo.db';

// Versão do schema, guardada no próprio arquivo (PRAGMA user_version).
// Para mudar o banco no futuro: crie a migração N+1 e aumente esta constante.
const SCHEMA_VERSION = 1;

const MIGRATIONS: Record<number, string> = {
  1: `
    CREATE TABLE machines (
      code  TEXT    PRIMARY KEY NOT NULL,
      model TEXT    NOT NULL,
      year  INTEGER NOT NULL
    );

    -- Usuários vêm da API de login; aqui só guardamos quem já reservou.
    CREATE TABLE users (
      user_id  TEXT PRIMARY KEY NOT NULL,
      username TEXT NOT NULL
    );

    -- Uma linha por reserva. As encerradas continuam aqui como histórico.
    -- Datas em milissegundos desde 1970 (Date.now()).
    CREATE TABLE reservations (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      machine_code    TEXT    NOT NULL REFERENCES machines(code),
      user_id         TEXT    NOT NULL REFERENCES users(user_id),
      reserved_at     INTEGER NOT NULL,
      expires_at      INTEGER NOT NULL,
      ended_at        INTEGER,
      end_reason      TEXT CHECK (end_reason IN ('cancelled', 'expired')),
      notification_id TEXT,
      CHECK (expires_at > reserved_at),
      CHECK ((ended_at IS NULL) = (end_reason IS NULL))
    );

    -- Regras de negócio garantidas pelo próprio banco:
    -- uma reserva ativa por máquina e uma reserva ativa por usuário.
    CREATE UNIQUE INDEX ux_reservations_active_machine
      ON reservations (machine_code) WHERE ended_at IS NULL;
    CREATE UNIQUE INDEX ux_reservations_active_user
      ON reservations (user_id) WHERE ended_at IS NULL;
    CREATE INDEX ix_reservations_active_expires
      ON reservations (expires_at) WHERE ended_at IS NULL;
  `,
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Abre o banco uma única vez e reaproveita a conexão em todas as chamadas.
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = openDatabase().catch((err) => {
      databasePromise = null; // permite tentar de novo na próxima chamada
      throw err;
    });
  }
  return databasePromise;
}

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  await migrate(db);
  await seedMachines(db);
  return db;
}

async function migrate(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;

  while (version < SCHEMA_VERSION) {
    const next = version + 1;
    await db.withExclusiveTransactionAsync(async (txn) => {
      await txn.execAsync(MIGRATIONS[next]);
      await txn.execAsync(`PRAGMA user_version = ${next}`);
    });
    version = next;
  }
}

// INSERT OR IGNORE: na primeira abertura cria as 5 máquinas; depois só acrescenta
// máquinas novas que forem adicionadas ao bd.json, sem mexer nas existentes.
async function seedMachines(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.withExclusiveTransactionAsync(async (txn) => {
    for (const machine of seed.machines) {
      await txn.runAsync(
        'INSERT OR IGNORE INTO machines (code, model, year) VALUES (?, ?, ?)',
        machine.code, machine.model, machine.year
      );
    }
  });
}
