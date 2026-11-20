import { useEffect, useRef, useState } from 'react';

// Contagem regressiva até "expiresAt" (ISO). Devolve os segundos restantes,
// ou null quando não há prazo (máquina livre ou reserva feita na Web).
// Quando chega a zero, chama onFinish uma vez (ex.: recarregar a máquina).
export function useCountdown(expiresAt: string | undefined, onFinish: () => void): number | null {
  const [now, setNow] = useState(() => Date.now());
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  useEffect(() => {
    if (!expiresAt) return;
    const end = new Date(expiresAt).getTime();

    const id = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= end) {
        clearInterval(id);
        onFinishRef.current();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [expiresAt]);

  if (!expiresAt) return null;
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 1000));
}

// 75 → "1:15"
export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
