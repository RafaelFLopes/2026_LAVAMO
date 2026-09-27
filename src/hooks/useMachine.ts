import { useCallback, useEffect, useState } from 'react';
import { Machine } from '@/@types/machine';
import { User } from '@/@types/user';
import {
  cancelReservation,
  getMachineByCode,
  MachineError,
  reserveMachine,
} from '@/integration/machineIntegration';

type ActionResult = { ok: boolean; message: string };

function errorMessage(err: unknown) {
  return err instanceof MachineError ? err.message : 'Não foi possível acessar os dados da máquina.';
}

export function useMachine(code: string, user: User | null) {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setMachine(await getMachineByCode(code));
      setError(null);
    } catch (err) {
      setMachine(null);
      setError(errorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  useEffect(() => {
    // Busca inicial; o estado só é atualizado depois da resposta (reload é assíncrono).
    let active = true;
    getMachineByCode(code)
      .then((data) => { if (active) { setMachine(data); setError(null); } })
      .catch((err) => { if (active) { setMachine(null); setError(errorMessage(err)); } })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [code]);

  async function runAction(action: () => Promise<Machine>, successMessage: string): Promise<ActionResult> {
    setIsSaving(true);
    try {
      setMachine(await action());
      return { ok: true, message: successMessage };
    } catch (err) {
      await reload();
      return { ok: false, message: errorMessage(err) };
    } finally {
      setIsSaving(false);
    }
  }

  const reserve = () => {
    if (!user) return Promise.resolve({ ok: false, message: 'Faça login novamente.' });
    return runAction(() => reserveMachine(code, user), 'Máquina reservada! Ela agora está em uso por você.');
  };

  const cancel = () => {
    if (!user) return Promise.resolve({ ok: false, message: 'Faça login novamente.' });
    return runAction(() => cancelReservation(code, user.userId), 'Reserva cancelada. A máquina está livre novamente.');
  };

  const isMine = !!user && machine?.reservedBy?.userId === user.userId;

  return { machine, isLoading, isSaving, isMine, error, reserve, cancel, reload };
}
