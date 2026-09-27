import AsyncStorage from '@react-native-async-storage/async-storage';
import seed from '../../bd.json';
import { Machine } from '@/@types/machine';
import { User } from '@/@types/user';

// "Banco de dados" mockado: o bd.json é a carga inicial (somente leitura, vai
// empacotado no app) e as alterações ficam salvas no AsyncStorage do aparelho.
// Se um dia existir uma API real, só este arquivo muda — as telas continuam iguais.
const STORAGE_KEY = '@Lavamo:machines';

export const MACHINE_CODE_PATTERN = /^LVM-\d{3}$/;

export class MachineError extends Error {}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

function seedMachines(): Machine[] {
  return (seed.machines as Machine[]).map((machine) => ({ ...machine }));
}

async function loadMachines(): Promise<Machine[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored) as Machine[];
  }

  const machines = seedMachines();
  await saveMachines(machines);
  return machines;
}

async function saveMachines(machines: Machine[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
}

function findOrFail(machines: Machine[], code: string): Machine {
  const machine = machines.find((m) => m.code === normalizeCode(code));
  if (!machine) {
    throw new MachineError(`Máquina ${normalizeCode(code)} não encontrada.`);
  }
  return machine;
}

export const getMachineByCode = async (code: string): Promise<Machine> => {
  const machines = await loadMachines();
  return findOrFail(machines, code);
};

export const getMyReservation = async (userId: string): Promise<Machine | null> => {
  const machines = await loadMachines();
  return machines.find((m) => m.reservedBy?.userId === userId) ?? null;
};

export const reserveMachine = async (code: string, user: User): Promise<Machine> => {
  const machines = await loadMachines();
  const machine = findOrFail(machines, code);

  if (!machine.available) {
    throw new MachineError(`A máquina ${machine.code} já está em uso por ${machine.reservedBy?.username}.`);
  }

  const current = machines.find((m) => m.reservedBy?.userId === user.userId);
  if (current) {
    throw new MachineError(`Você já está usando a máquina ${current.code}. Cancele a reserva antes de usar outra.`);
  }

  machine.available = false;
  machine.reservedBy = {
    userId: user.userId,
    username: user.username,
    reservedAt: new Date().toISOString(),
  };

  await saveMachines(machines);
  return machine;
};

export const cancelReservation = async (code: string, userId: string): Promise<Machine> => {
  const machines = await loadMachines();
  const machine = findOrFail(machines, code);

  if (machine.reservedBy?.userId !== userId) {
    throw new MachineError('Só quem reservou a máquina pode cancelar a reserva.');
  }

  machine.available = true;
  machine.reservedBy = null;

  await saveMachines(machines);
  return machine;
};
