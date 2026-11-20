// Regras e utilitários das máquinas que valem igual no Android (SQLite) e na Web (AsyncStorage).
// As duas implementações de machineIntegration reexportam daqui, então as telas
// continuam importando tudo de '@/integration/machineIntegration'.

export const MACHINE_CODE_PATTERN = /^LVM-\d{3}$/;

export class MachineError extends Error {}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}
